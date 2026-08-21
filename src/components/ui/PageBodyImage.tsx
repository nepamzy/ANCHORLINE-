import { Container } from "./Container";

/**
 * A full, uncropped illustrative photo shown within a page's body content
 * (not the header). Renders at natural aspect ratio (w-full h-auto) so the
 * complete image is always visible — nothing is cropped or cut off.
 */
export function PageBodyImage({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div className="bg-offwhite py-4 sm:py-6">
      <Container>
        <img
          src={src}
          alt={alt}
          className="mx-auto h-auto w-full max-w-3xl rounded-control shadow-lg"
        />
      </Container>
    </div>
  );
}
