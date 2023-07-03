export interface AppLayoutProps {
  children: React.ReactNode;
}

export interface PrivateRoute {
  children: React.ReactNode;
  path?: string;
  exact?: boolean;
}

export interface video {
  title: string;
  videoUrl: string;
  sharedBy: string;
  description: string;
}
