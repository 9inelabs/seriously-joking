import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Registration } from "./registrations";
import { PACKAGES, isTablePackage } from "./packages";
import { EVENT } from "./event";

// Brand palette (matches the on-screen ticket)
const C = {
  ink1: "#050B14",
  ink2: "#0A1628",
  ink3: "#0F1E36",
  line: "#1F3461",
  gold1: "#F4D58F",
  gold2: "#D4A74A",
  cream: "#F5EDD8",
  cream2: "#E4D9BB",
  mute: "#8A93A6",
};

const styles = StyleSheet.create({
  page: { flexDirection: "row", backgroundColor: C.ink1, color: C.cream },
  main: { flexGrow: 1, padding: 26, justifyContent: "space-between" },

  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,167,74,0.25)",
    paddingBottom: 12,
  },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 11, letterSpacing: 2, color: C.cream2 },
  brandSub: { fontFamily: "Helvetica", fontSize: 7, letterSpacing: 2, color: C.mute, marginTop: 2 },
  tierBadge: {
    backgroundColor: C.gold2,
    color: C.ink1,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  title: { fontFamily: "Helvetica-Bold", fontSize: 40, color: C.gold1, letterSpacing: 1, lineHeight: 1 },
  titleInk: { color: C.cream },
  tagline: { fontFamily: "Helvetica-Oblique", fontSize: 14, color: C.gold1, marginTop: 6 },

  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  cell: { width: "50%", marginBottom: 10 },
  cellFull: { width: "100%", marginBottom: 6 },
  key: { fontFamily: "Helvetica-Bold", fontSize: 7, letterSpacing: 1.5, color: C.gold2, marginBottom: 3 },
  val: { fontFamily: "Helvetica-Bold", fontSize: 12, color: C.cream },
  sub: { fontFamily: "Helvetica", fontSize: 8, color: C.mute, marginTop: 2 },

  note: {
    marginTop: 8,
    flexDirection: "row",
    backgroundColor: "rgba(212,167,74,0.08)",
    borderWidth: 1,
    borderColor: "rgba(212,167,74,0.22)",
    borderRadius: 6,
    padding: 10,
  },
  noteText: { fontSize: 9, color: C.cream2, lineHeight: 1.4 },
  noteStrong: { fontFamily: "Helvetica-Bold", color: C.gold1 },

  perf: { width: 1, borderLeftWidth: 1, borderLeftColor: "rgba(212,167,74,0.4)", borderStyle: "dashed" },

  stub: {
    width: 210,
    backgroundColor: C.ink3,
    padding: 22,
    alignItems: "center",
    justifyContent: "space-between",
  },
  stubLabel: { fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 2, color: C.gold2 },
  qrWrap: { backgroundColor: C.cream, padding: 8, borderRadius: 6 },
  qr: { width: 150, height: 150 },
  stubIdLabel: { fontSize: 7, letterSpacing: 2, color: C.mute, marginBottom: 3, textAlign: "center" },
  stubId: { fontFamily: "Courier-Bold", fontSize: 11, letterSpacing: 1, color: C.cream2, textAlign: "center" },
});

function fmt(reg: Registration) {
  const d = new Date(EVENT.dateISO);
  const opts = { timeZone: "Africa/Lagos" } as const;
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", ...opts }),
    weekday: d.toLocaleDateString("en-GB", { weekday: "long", ...opts }),
    time: d
      .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, ...opts })
      .toUpperCase(),
  };
}

export function TicketDocument({
  registration,
  qrDataUrl,
}: {
  registration: Registration;
  qrDataUrl: string;
}) {
  const pkg = PACKAGES[registration.package_type];
  const isTable = isTablePackage(registration.package_type);
  const { date, weekday, time } = fmt(registration);

  return (
    <Document
      title={`Seriously Joking ticket — ${registration.ref_number}`}
      author={EVENT.brand}
    >
      <Page size={[780, 330]} style={styles.page}>
        {/* main */}
        <View style={styles.main}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brandName}>HOUSE OF OGA MICKO</Text>
              <Text style={styles.brandSub}>PRESENTS</Text>
            </View>
            <Text style={styles.tierBadge}>
              {pkg.name.toUpperCase()} · {pkg.tier.toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.title}>
              <Text style={styles.titleInk}>SERIOUSLY </Text>JOKING
            </Text>
            <Text style={styles.tagline}>Live with {EVENT.headliner}</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.key}>{isTable ? "TABLE HOST" : "ATTENDEE"}</Text>
              <Text style={styles.val}>{registration.full_name}</Text>
              <Text style={styles.sub}>{registration.phone}</Text>
            </View>
            <View style={styles.cell}>
              {isTable ? (
                <>
                  <Text style={styles.key}>TABLE NAME</Text>
                  <Text style={styles.val}>{registration.table_name || pkg.name}</Text>
                  <Text style={styles.sub}>{pkg.seats} seats</Text>
                </>
              ) : (
                <>
                  <Text style={styles.key}>ADMITS</Text>
                  <Text style={styles.val}>{pkg.seats === 1 ? "1 guest" : `${pkg.seats} guests`}</Text>
                  <Text style={styles.sub}>{pkg.unit}</Text>
                </>
              )}
            </View>
            <View style={styles.cell}>
              <Text style={styles.key}>DATE</Text>
              <Text style={styles.val}>{date}</Text>
              <Text style={styles.sub}>{weekday} · doors 5 PM</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.key}>SHOWTIME</Text>
              <Text style={styles.val}>{time}</Text>
              <Text style={styles.sub}>show ends ~till mama calls</Text>
            </View>
            <View style={styles.cellFull}>
              <Text style={styles.key}>VENUE</Text>
              <Text style={styles.val}>{EVENT.venue}</Text>
            </View>
          </View>

          {isTable && (
            <View style={styles.note}>
              <Text style={styles.noteText}>
                <Text style={styles.noteStrong}>Valid for a table of {pkg.seats}. </Text>
                All guests enter together with the table host. Names can be edited up to 24h
                before the show.
              </Text>
            </View>
          )}
        </View>

        {/* perforation */}
        <View style={styles.perf} />

        {/* stub */}
        <View style={styles.stub}>
          <Text style={styles.stubLabel}>SCAN AT THE DOOR</Text>
          <View style={styles.qrWrap}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.qr} src={qrDataUrl} />
          </View>
          <View>
            <Text style={styles.stubIdLabel}>TICKET ID</Text>
            <Text style={styles.stubId}>{registration.ticket_id}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
