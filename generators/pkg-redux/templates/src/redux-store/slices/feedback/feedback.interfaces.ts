export type FeedbackType = "success" | "error" | "info" | "warning";

export interface FeedbackState {
  open: boolean;
  type: FeedbackType;
  message: string;
}
