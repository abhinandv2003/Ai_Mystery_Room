// Fixed, fictional UI fixture for Phase 2. This data never comes from a production API.
export const sampleCase = {
  id: 'sample',
  reference: 'AMR-0247',
  title: 'The Last Projection',
  category: 'Museum theft',
  difficulty: 'Medium',
  date: '18 October · 9:20 PM',
  location: 'North Gallery, Bellweather Museum',
  summary: 'During a ninety-second projection failure at the Bellweather Museum, the one-of-a-kind Solstice miniature vanished from a locked display. Four people had the access, timing, or opportunity to make it happen.',
  objectives: ['Establish who could reach the display during the outage.', 'Separate verified records from the suspects’ accounts.', 'Explain how the projection failure and the theft are connected.'],
  suspects: [
    { id: 'mara', name: 'Mara Venn', role: 'Senior conservator', age: 38, initials: 'MV', color: 'sage', motive: 'The museum had rejected her proposal to transfer the miniature to a conservation archive.', alibi: 'Says she was in the conservation lab preparing a humidity report.', detail: 'Mara had routine access to the display case. A pale powder on her sleeve was identified as archival chalk used in the lab.' },
    { id: 'elias', name: 'Elias Rook', role: 'Collections curator', age: 46, initials: 'ER', color: 'rose', motive: 'A private collector had offered to fund his failing gallery project in exchange for the miniature.', alibi: 'Says he left the museum before the projection began.', detail: 'Elias approved the evening gallery schedule and had temporary access to the projection controls.' },
    { id: 'nia', name: 'Nia Park', role: 'Projection technician', age: 29, initials: 'NP', color: 'blue', motive: 'Her contract renewal was under review after repeated equipment faults.', alibi: 'Says she remained in the projection booth for the entire interruption.', detail: 'Nia could interrupt the projection remotely, but the control system records which staff credential issued each command.' },
    { id: 'owen', name: 'Owen Bell', role: 'Night security officer', age: 54, initials: 'OB', color: 'amber', motive: 'He had recently been reprimanded for an unlogged gallery exit.', alibi: 'Says he was at the east desk completing the hourly patrol sheet.', detail: 'Owen carried the master key, but the sealed display records each opening and remains undisturbed.' },
  ],
  evidence: [
    { id: 'access-log', title: 'Gallery access log', type: 'Access record', category: 'Records', time: '9:14 PM', source: 'North Gallery door sensor', credibility: 'Verified record', related: ['elias', 'mara', 'owen'], summary: 'The gallery door opened once during the blackout window.', content: '21:14:08 — Collections credential E. Rook entered North Gallery.\n21:19:41 — Door opened from inside; Security credential O. Bell exited.\nNo display-case opening was recorded. The miniature was removed through the unlatched rear service panel, which is not monitored by the case sensor.' },
    { id: 'projection-log', title: 'Projection control log', type: 'System record', category: 'Records', time: '9:12 PM', source: 'Projection booth console', credibility: 'Verified record', related: ['elias', 'nia'], summary: 'A scheduled test loop was activated shortly before the interruption.', content: '21:12:03 — Test loop scheduled using curator access token E. Rook.\n21:16:10 — Projection output paused for 90 seconds.\n21:17:40 — Output restored.\nNia Park’s booth credential was not used to start or resume the loop.' },
    { id: 'radio-transcript', title: 'Security radio transcript', type: 'Radio transcript', category: 'Messages', time: '9:15 PM', source: 'Fictional museum radio archive', credibility: 'Recorded statement', related: ['elias', 'owen'], summary: 'A brief exchange places the curator near the gallery after he says he has left.', content: '21:15:22 · Owen: “Curator, did you leave the blue folio at the north desk?”\n21:15:29 · Elias: “I’m already outside. Leave it with the night paperwork.”\n21:15:44 · Owen: “Copy.”\n\nThe radio relay log places Elias’s handset inside the north gallery wing at the time of the reply.' },
    { id: 'lab-report', title: 'Conservation lab report', type: 'Staff report', category: 'Statements', time: '9:05 PM', source: 'Signed lab record · Mara Venn', credibility: 'Claim with supporting record', related: ['mara'], summary: 'Mara’s lab activity is documented, but the report does not cover the full outage window.', content: 'Mara Venn signed a humidity reading at 21:03. The next scheduled reading was not due until 21:30. A prepared note on the counter reads “north gallery — frame check” in her handwriting, but the note is undated.' },
    { id: 'case-inspection', title: 'Display case inspection', type: 'Inspection report', category: 'Physical evidence', time: '9:32 PM', source: 'Fictional scene technician report', credibility: 'Verified observation', related: ['elias', 'mara', 'owen'], summary: 'The glass and lock are intact; a service panel behind the wall label was loosened.', content: 'No damage to the glass or front lock. The rear service panel was opened with a narrow tool and replaced without disturbing the display seal. Fine brass dust was found on the panel screw and on the edge of a curator’s blue folio recovered at the north desk.' },
    { id: 'patrol-sheet', title: 'Night patrol sheet', type: 'Security document', category: 'Records', time: '9:10–9:25 PM', source: 'Security desk clipboard', credibility: 'Claim with conflicting record', related: ['owen'], summary: 'Owen’s handwritten patrol time conflicts with the door sensor.', content: 'Owen recorded an east desk check at 21:17. The north gallery door sensor logs his security credential exiting the gallery at 21:19. The entry is written in blue ink, while the surrounding entries are in black.' },
  ],
  timeline: [
    { time: '8:40 PM', label: 'Evening tour ends', detail: 'The last visitors leave the North Gallery.', source: 'Visitor count record', verified: true },
    { time: '9:03 PM', label: 'Mara signs a lab reading', detail: 'Her next scheduled reading is not until 9:30 PM.', source: 'Conservation lab report', verified: true },
    { time: '9:12 PM', label: 'Test loop is scheduled', detail: 'The curator’s access token starts a projection test.', source: 'Projection control log', verified: true },
    { time: '9:14 PM', label: 'Curator enters the gallery', detail: 'Elias’s credential opens the gallery door.', source: 'Access log', verified: true },
    { time: '9:16 PM', label: 'Projection goes dark', detail: 'The scheduled loop pauses for ninety seconds.', source: 'Projection control log', verified: true },
    { time: '9:17 PM', label: 'Curator claims to be outside', detail: 'The radio relay still places his handset in the gallery wing.', source: 'Radio transcript', verified: false },
    { time: '9:19 PM', label: 'Security exits the gallery', detail: 'Owen’s credential records an exit during the outage window.', source: 'Access log', verified: true },
    { time: '9:20 PM', label: 'Display is found empty', detail: 'The projection returns; the miniature is missing.', source: 'Incident report', verified: true },
  ],
};

export const evidenceCategories = ['All evidence', 'Records', 'Messages', 'Statements', 'Physical evidence'];
