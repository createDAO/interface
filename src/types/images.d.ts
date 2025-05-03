// Type declarations for image file formats
declare module '*.png' {
  const content: import('next/image').StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: { src: string };
  export default content;
}
