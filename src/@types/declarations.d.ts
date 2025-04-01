declare module "*.scss" {
  const content: { readonly [className: string]: string };
  export default content;
}

declare module "*?worker" {
  const workerConstructor: {
    new (options?: { name?: string }): Worker;
  };
  export default workerConstructor;
}
