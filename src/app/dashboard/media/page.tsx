import { list } from "@vercel/blob";
import { MediaUploader } from "./MediaUploader";

/**
 * Lists uploaded media from Vercel Blob (see src/app/api/dashboard/upload/route.ts —
 * uploads no longer land on the local filesystem, which doesn't
 * persist on Vercel's serverless functions).
 */
async function listMedia(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: "media/" });
    return blobs
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((b) => b.url);
  } catch (err) {
    console.error("[media] Blob list failed:", err);
    return [];
  }
}

export default async function MediaPage() {
  const files = await listMedia();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Images / Media</h1>
      <p className="mt-1 text-slate max-w-xl">
        Upload images here to use on the website. Copy an image&apos;s link
        and send it to your developer to place it, or paste it into a
        content field that accepts an image link.
      </p>

      <MediaUploader />

      {files.length === 0 ? (
        <p className="mt-8 text-slate">No images uploaded yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-card border border-line">
              {/* Thumbnail of an arbitrary uploaded file — dimensions unknown ahead of time, so next/image's required width/height don't fit a simple grid thumbnail here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-32 w-full object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
