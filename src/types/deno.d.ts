declare module "https://deno.land/x/xhr@0.1.0/mod.ts" {}
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export interface ServeInit {
    port?: number;
    hostname?: string;
    handler: (request: Request) => Response | Promise<Response>;
  }

  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
  export function serve(options: ServeInit): void;
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
  };
}; 