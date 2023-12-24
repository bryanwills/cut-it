"use client";

import { toast } from "sonner";

import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type CopyToClipboardProps = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: CopyToClipboardProps) => {
  const handleOnCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    toast("Copied to clipboard");
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          className="cursor-pointer transition-opacity opacity-50 hover:opacity-100"
          aria-label="Copy to clipboard"
          type="button"
        >
          <Icons.Copy
            className={iconVariants({ size: "sm" })}
            onClick={handleOnCopy}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">Copy link to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
};
