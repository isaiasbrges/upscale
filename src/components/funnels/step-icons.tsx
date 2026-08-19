import {
  Layout,
  FileText,
  Ticket,
  ClipboardList,
  CreditCard,
  PartyPopper,
  ArrowRightCircle,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { FunnelStepType } from "@/actions/funnel-steps";

export const FUNNEL_STEP_TYPE_ICONS: Record<FunnelStepType, LucideIcon> = {
  LANDING_PAGE: Layout,
  PAGE: FileText,
  SCRATCH_CARD: Ticket,
  FORM: ClipboardList,
  CHECKOUT: CreditCard,
  THANK_YOU: PartyPopper,
  REDIRECT: ArrowRightCircle,
  EXTERNAL_URL: Link2,
};
