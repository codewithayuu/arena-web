export const MONACO_VS_ASSET_PATH = "/vendor/monaco/vs";

export type MonacoLoaderConfig = {
  config: (configuration: { paths: { vs: string } }) => unknown;
};

/** Pin the AMD loader to static files served by this application origin. */
export function configureMonacoLoader(loader: MonacoLoaderConfig): void {
  loader.config({ paths: { vs: MONACO_VS_ASSET_PATH } });
}
