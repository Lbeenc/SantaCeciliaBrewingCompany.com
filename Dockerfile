# Builds the whole site (React client + ASP.NET Core API) into one container image.
# Google Cloud Run builds this automatically from the GitHub repo; see "Deploying" in README.md.

# ---- Stage 1: build the React client ----
# `npm run build` writes into ../server/SantaCecilia.Api/wwwroot (see client/vite.config.ts),
# so the folder layout here mirrors the repo.
FROM node:24-alpine AS client
WORKDIR /src
COPY client/package.json client/package-lock.json client/
RUN cd client && npm ci
COPY client/ client/
RUN cd client && npm run build

# ---- Stage 2: publish the ASP.NET Core API, with the built site in its wwwroot ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY server/SantaCecilia.Api/SantaCecilia.Api.csproj server/SantaCecilia.Api/
RUN dotnet restore server/SantaCecilia.Api/SantaCecilia.Api.csproj
COPY server/ server/
COPY --from=client /src/server/SantaCecilia.Api/wwwroot server/SantaCecilia.Api/wwwroot
RUN dotnet publish server/SantaCecilia.Api/SantaCecilia.Api.csproj -c Release -o /app/publish --no-restore

# ---- Stage 3: the small runtime image that actually runs ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Email sign-ups are written to App_Data. The image runs as the non-root "app"
# user, so give it a folder it can write to. Note: Cloud Run's disk is temporary;
# see "Email sign-ups" in README.md.
RUN mkdir -p /app/App_Data && chown app /app/App_Data
USER app

# Cloud Run sends traffic to port 8080, which is also the .NET image's default.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "SantaCecilia.Api.dll"]
