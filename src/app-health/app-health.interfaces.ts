export interface AppHealth {
  status: AppHealthStatus;
  currentVersion: string;
  AppDependencies?: [AppDependencies]
}

export interface AppDependencies {
  name: string;
  description: string;
  host: string;
  port?: string;
  credentials?: DependencyCredentials;
  status: AppHealthStatus;
  version: string;
  diagnosis?: string; // Add error details here in case it's unhealthy
  responseTime?: string; // time it took to connect to the service
}

export interface DependencyCredentials {
  username: string;
}

export enum AppHealthStatus {
  GREEN = "HEALTHY", // Able to reach to the dependency
  RED = "UNHEALTHY", // Unable to connect to dependency
}