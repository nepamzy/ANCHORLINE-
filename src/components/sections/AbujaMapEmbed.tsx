/**
 * Real, interactive Google Maps embed centered on Abuja, FCT — the
 * standard keyless `/maps?output=embed` iframe (no API key required,
 * unlike the JS Maps Embed API), so it needs no credentials from the
 * client. Visitors can pan and zoom exactly like a normal Google Maps
 * page. Replaces the earlier abstract dotted-circle diagram.
 */
export function AbujaMapEmbed() {
  return (
    <div className="overflow-hidden rounded-card border border-line shadow-card">
      <iframe
        title="Abuja, Federal Capital Territory, Nigeria, Anchorline's base of coverage"
        src="https://maps.google.com/maps?q=Abuja,+Federal+Capital+Territory,+Nigeria&z=10&output=embed"
        className="h-[360px] w-full sm:h-[440px]"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
