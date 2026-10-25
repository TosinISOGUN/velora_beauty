import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { LinkTarget } from "@/data/site";

type Props = {
  target: LinkTarget;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

/** Link for the typed navigation data, which mixes plain and parameterised routes. */
export function NavLink({ target, className, onClick, children }: Props) {
  if (target.to === "/collections/$slug") {
    return (
      <Link to={target.to} params={target.params} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={target.to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
