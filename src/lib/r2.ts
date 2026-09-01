import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Object storage for uploaded images/video: Cloudflare R2, accessed
 * through its S3-compatible API (no Cloudflare-specific SDK exists for
 * this, so this is the same @aws-sdk/client-s3 anyone would use against
 * real S3 — just pointed at R2's endpoint).
 *
 * Requires CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID,
 * CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET, and
 * CLOUDFLARE_R2_PUBLIC_URL (see .env.example). Callers check
 * hasR2Credentials() first and fall back to local disk writes when
 * unset, e.g. local development before these are configured.
 */

export function hasR2Credentials(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET &&
      process.env.CLOUDFLARE_R2_PUBLIC_URL
  );
}

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
  return client;
}

function publicUrlFor(key: string): string {
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}

/** Server-proxied upload — the file's bytes pass through this Next.js server. Fine for small files (images, PDFs), not the video (see presignedPutUrl). */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET!;
  await getR2Client().send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  );
  return publicUrlFor(key);
}

/** Lists uploaded files under a given prefix (e.g. "media/"), newest first — backs the dashboard's media browse gallery. */
export async function listObjects(prefix: string): Promise<{ url: string; uploadedAt: Date }[]> {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET!;
  const result = await getR2Client().send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }));
  return (result.Contents ?? [])
    .filter((obj) => obj.Key)
    .map((obj) => ({ url: publicUrlFor(obj.Key!), uploadedAt: obj.LastModified ?? new Date(0) }))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

/** A short-lived URL the browser can PUT directly to R2, bypassing this server entirely — the only way a 100MB+ video can be uploaded at all on Vercel (serverless functions there cap request bodies at ~4.5MB). */
export async function presignedPutUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET!;
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 600 });
  return { uploadUrl, publicUrl: publicUrlFor(key) };
}
