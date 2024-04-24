type CORS = {
  origin?: string;
};

export interface ServerConfigInterface {
  environment: 'development' | 'production' | 'test';
  port: number;
  cors: CORS;
}
