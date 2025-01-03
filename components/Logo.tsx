import { PiggyBank } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke size-11  stroke-amber-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text  text-3xl font-bold text-transparent leading-light teacking-tighter">
        Spendly
      </p>
    </Link>
  );
};

export default Logo;
