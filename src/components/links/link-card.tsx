import Image from "next/image";
import { type ShortLink } from "~/server/db/schema";
import { formatDistanceToNowStrict } from "date-fns";
import { type Session } from "next-auth";

import { formatNumber, getBaseUrl } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { LinkCopyButton } from "~/components/links/link-copy-button";
import { LinkOptionsDropdown } from "~/components/links/link-options-dropdown";

type LinkCardProps = {
  link: ShortLink;
  session?: Session | null;
  disableOptions?: boolean;
  hideCreatedAtTime?: boolean;
};

export const LinkCard = ({
  link,
  session,
  disableOptions,
  hideCreatedAtTime,
}: LinkCardProps) => {
  const { slug, url, views } = link;
  const decodedURL = decodeURIComponent(url);
  const shortenedURL = `${getBaseUrl()}/${slug}`;

  return (
    <Card className="relative hover:border-foreground dark:hover:border-neutral-500 transition-colors">
      <CardContent className="flex gap-2 p-3">
        <div className="flex flex-col min-w-8 justify-center">
          <Image
            src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
              new URL(decodedURL).origin
            }&size=64`}
            className="rounded-full"
            alt="link favicon"
            width={32}
            height={32}
            quality={100}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-x-3 gap-y-2 pe-8 flex-wrap">
            <a
              href={shortenedURL}
              className="font-medium font-mono"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenedURL.split("://")[1]}
            </a>
            <div className="flex items-center gap-2">
              <LinkCopyButton textToCopy={shortenedURL} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex font-mono cursor-pointer items-center gap-1 transition-opacity opacity-50 hover:opacity-100"
                    type="button"
                  >
                    <Icons.Eye
                      className={iconVariants({ size: "sm" })}
                      aria-label="Total views"
                    />
                    <span className="text-xs">
                      {formatNumber(views, { notation: "compact" })}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {formatNumber(views, { notation: "standard" })} Total views
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="max-w-52 flex flex-col gap-2 sm:max-w-72 w-full text-xs text-muted-foreground">
            <a
              href={decodedURL}
              className="truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {decodedURL}
            </a>
            {link.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-1 cursor-pointer">
                    {link.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>{link.description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardContent>
      <LinkOptionsDropdown
        className="absolute right-2 top-3"
        link={{ ...link, url: decodedURL }}
        session={session}
        disabled={disableOptions}
      />
      {!hideCreatedAtTime && (
        <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground font-medium">
          <Tooltip>
            <TooltipTrigger>
              {formatDistanceToNowStrict(new Date(link.createdAt), {
                addSuffix: true,
              })}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(link.createdAt))}
              </p>
            </TooltipContent>
          </Tooltip>
        </span>
      )}
    </Card>
  );
};
