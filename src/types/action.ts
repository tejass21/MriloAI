
import { ReactNode } from "react";

export interface ActionType {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
  short: string;
  end: string;
}
