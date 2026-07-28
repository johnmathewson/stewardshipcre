/**
 * A2P 10DLC consent language — single source of truth.
 *
 * This exact string is what gets submitted to Twilio / The Campaign Registry
 * as the Message Flow / Call-to-Action opt-in description. The checkbox label
 * rendered on the site and the text stored on the lead record both derive
 * from here, so the three can never drift apart. If you change the wording,
 * the campaign registration must be updated to match.
 *
 * Requirements this language satisfies:
 *   - Brand name present ........................ "Stewardship CRE"
 *   - Purpose / program description ............. conversational + customer care
 *   - Message frequency disclosure .............. "Msg frequency varies"
 *   - Cost disclosure ........................... "Msg & data rates may apply"
 *   - Opt-out instructions ...................... "Reply STOP to opt out"
 *   - Help instructions ......................... "HELP for help"
 *   - Not a condition of service ................ final sentence
 *   - Privacy Policy + Terms links .............. rendered adjacent to label
 *
 * CRITICAL: this must be presented as an UNCHECKED checkbox requiring an
 * affirmative tick. Passive "by submitting you agree" phrasing is implied
 * consent and fails TCR vetting (errors 30909 / 30925).
 */
export const SMS_CONSENT_TEXT =
  'I agree to receive conversational and customer-care text messages from ' +
  'Stewardship CRE about the listing(s) I inquired about. Msg frequency ' +
  'varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. ' +
  'Consent is not a condition of any service.'
