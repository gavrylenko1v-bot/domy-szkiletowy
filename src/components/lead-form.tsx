import { LeadFormClient } from "./lead-form-client";
export function LeadForm(props: { projectId?: string; compact?: boolean }) {
  const mail = !!(
    process.env.RESEND_API_KEY &&
    process.env.LEADS_FROM_EMAIL &&
    process.env.LEADS_TO_EMAIL
  );
  const limiter =
    process.env.NODE_ENV !== "production" ||
    !!(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    );
  return <LeadFormClient {...props} available={mail && limiter} />;
}
