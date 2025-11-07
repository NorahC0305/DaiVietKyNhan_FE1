"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLandscapeMobile } from "@/hooks/useLandscapeMobile";
import kynhanService from "@/services/kynhan";
import type { IKyNhanUserListResponseModel } from "@/models/ky-nhan/response";
import type { IKyNhanUser } from "@/models/ky-nhan/entity";
import EmblaCarouselWithCards from "./Components/InfiniteCardCarousel";
import NoKyNhan from "@/components/Molecules/Popup/NoKyNhan";
import { Loader2 } from "lucide-react";

interface CardData {
  id: number;
  unlocked: boolean;
  imageSrc?: string;
  backContent?: {
    backgroundSrc?: string;
    name?: string;
    thoiKy?: string;
    chienCong?: string;
    ctaText?: string;
    ctaHref?: string;
  };
}

const LibraryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDailyCheckinOpen, setIsDailyCheckinOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenSearchId, setHiddenSearchId] = useState<string | null>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(
    undefined
  );
  const [highlightQuery, setHighlightQuery] = useState<string>("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoKyNhanModal, setShowNoKyNhanModal] = useState(false);
  const isLandscapeMobile = useLandscapeMobile();

  const STORAGE_KEY_LAST_CARD_ID = "dvkn:lastLibraryCardId";

  // Handle CTA button click - navigate to library detail page
  const handleCtaClick = (cardId: number) => {
    try {
      sessionStorage.setItem(STORAGE_KEY_LAST_CARD_ID, String(cardId));
    } catch (e) { }
    router.push(`/library/${cardId}`);
  };

  // Convert API data to CardData format
  const convertToCardData = (kynhanData: IKyNhanUser): CardData => ({
    id: kynhanData.id,
    unlocked: kynhanData.unlocked,
    imageSrc: kynhanData.imgUrl || undefined,
    backContent: {
      backgroundSrc: "https://res.cloudinary.com/dznt9yias/image/upload/v1760726112/revealedBG_gzuiid.svg",
      name: kynhanData.name,
      thoiKy: kynhanData.thoiKy,
      chienCong: kynhanData.chienCong,
      ctaText: "Xem Thêm",
      ctaHref: undefined, // Remove href since we're using onClick handler
    },
  });

  // Handle URL search parameter - check if it's an ID to auto scroll
  useEffect(() => {
    const searchParam = searchParams?.get("search");
    console.log("searchParam", searchParam);
    if (searchParam) {
      setHiddenSearchId(searchParam);
      // Clear URL parameter after reading it and prevent back navigation to map
      router.replace("/library", { scroll: false });

      // Add a new history entry to prevent back to map page
      window.history.pushState(null, "", "/library");
    }
  }, [searchParams, router]);

  // Prevent back navigation to map when coming from map
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If user tries to go back, push current state again
      window.history.pushState(null, "", "/library");
    };

    // Only add listener if we came from map with search parameter
    if (hiddenSearchId !== null) {
      // Push current state to history to establish new base
      window.history.pushState(null, "", "/library");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hiddenSearchId]);

  // Fetch kynhan data from API
  useEffect(() => {
    const fetchKynhanList = async () => {
      try {
        setIsLoading(true);
        const response =
          (await kynhanService.getUserKyNhanList()) as IKyNhanUserListResponseModel;
        if (response.data && response.data.results) {
          const cardData = response.data.results.map(convertToCardData);
          setCards(cardData);
          // Check if user owns any kỳ nhân using totalKyNhanClaim field
          const hasOwnedKyNhan = response.data.totalKyNhanClaim > 0;

          // Show modal if user owns 0 kỳ nhân
          if (!hasOwnedKyNhan) {
            setShowNoKyNhanModal(true);
          }
        } else {
          // Show modal if no data received
          setShowNoKyNhanModal(true);
        }
      } catch (error) {
        console.error("Error fetching kynhan list:", error);
        // Show modal on error since we can't determine ownership
        setShowNoKyNhanModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKynhanList();
  }, [searchQuery]);

  const normalizeText = (text?: string) =>
    (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  const triggerSearchScroll = useCallback(
    (searchValue?: string) => {
      const q = normalizeText(searchValue || searchQuery);
      if (!q) return;

      // Only search by name
      const index = cards.findIndex((c) => {
        const name = normalizeText(c.backContent?.name);
        return name.includes(q);
      });

      if (index >= 0) {
        setScrollToIndex(index);
        setHighlightQuery(q);
      }
    },
    [searchQuery, cards]
  );

  // Auto scroll to kỳ nhân by ID when hiddenSearchId is set from URL and cards are loaded
  useEffect(() => {
    if (hiddenSearchId && cards.length > 0 && !isLoading) {
      // Check if hiddenSearchId is a numeric ID
      const asNumber = Number(hiddenSearchId);
      if (!Number.isNaN(asNumber)) {
        // Find card by ID and scroll to it
        const index = cards.findIndex((c) => c.id === asNumber);
        if (index >= 0) {
          setScrollToIndex(index);
          setHighlightQuery(""); // Clear highlight since we're not searching by text
        }
      } else {
        // If it's not a number, treat it as text search
        triggerSearchScroll(hiddenSearchId);
      }

      // Clear hiddenSearchId after using it
      setHiddenSearchId(null);
    }
  }, [hiddenSearchId, cards, isLoading, triggerSearchScroll]);

  // Restore last viewed card position if returning from detail page
  useEffect(() => {
    if (cards.length > 0 && !isLoading) {
      try {
        const lastId = sessionStorage.getItem(STORAGE_KEY_LAST_CARD_ID);
        if (lastId) {
          const asNumber = Number(lastId);
          if (!Number.isNaN(asNumber)) {
            const index = cards.findIndex((c) => c.id === asNumber);
            if (index >= 0) {
              setScrollToIndex(index);
              setHighlightQuery("");
            }
          }
          sessionStorage.removeItem(STORAGE_KEY_LAST_CARD_ID);
        }
      } catch (e) { }
    }
  }, [cards, isLoading]);

  // Wrapper function for search button clicks
  const handleSearchClick = () => {
    triggerSearchScroll();
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden pt-8 sm:pt-12 lg:pt-0">
      {/* Thanh tìm kiếm (mobile landscape only) */}
      {isLandscapeMobile && (
        <div className="lg:hidden absolute top-2 right-2 sm:top-4 sm:right-4 translate-x-0 z-10 w-[35%] sm:w-[30%]">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerSearchScroll();
              }}
              type="text"
              placeholder="Tìm kiếm kỳ nhân"
              className="w-full h-8 sm:h-10 pl-3 sm:pl-4 pr-10 sm:pr-12 rounded-full bg-white/90 backdrop-blur text-black placeholder-gray-500 text-xs sm:text-sm shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
            />
            <button
              aria-label="Tìm kiếm"
              onClick={handleSearchClick}
              className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4 text-gray-600"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-6 sm:h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 0 1 5.276 10.917l4.279 4.278a.75.75 0 1 1-1.06 1.06l-4.279-4.278A6.75 6.75 0 1 1 10.5 3.75Zm0 1.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Thanh tìm kiếm (desktop giữ nguyên) */}
      <div className="hidden lg:flex justify-center items-center mt-10">
        <div className="relative w-[25%]">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") triggerSearchScroll();
            }}
            type="text"
            placeholder="Tìm kiếm kỳ nhân"
            className="w-full h-11 md:h-12 pl-4 pr-12 rounded-full bg-white/90 backdrop-blur text-black placeholder-gray-500 shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
          />
          <button
            aria-label="Tìm kiếm"
            onClick={handleSearchClick}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 0 1 5.276 10.917l4.279 4.278a.75.75 0 1 1-1.06 1.06l-4.279-4.278A6.75 6.75 0 1 1 10.5 3.75Zm0 1.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen w-full flex items-center justify-center py-4 lg:py-10 mt-10 lg:mt-0">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-8 w-8 text-[#835D26] animate-spin" />
            <div className="text-[#835D26] font-medium">
              Đang tải dữ liệu...
            </div>
          </div>
        ) : (
          <EmblaCarouselWithCards
            cards={cards}
            options={{ loop: true, align: "center" }}
            scrollToIndex={scrollToIndex}
            highlightQuery={highlightQuery}
            onCtaClick={handleCtaClick}
          />
        )}
      </div>

      {/* NoKyNhan Modal */}
      <NoKyNhan
        isOpen={showNoKyNhanModal}
        onClose={() => setShowNoKyNhanModal(false)}
      />
    </div>
  );
};

export default LibraryPage;
