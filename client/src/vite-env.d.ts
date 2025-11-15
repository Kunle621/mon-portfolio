/// <reference types="vite/client" />

// Déclaration pour les fichiers CSS
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Déclaration pour les fichiers image
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
