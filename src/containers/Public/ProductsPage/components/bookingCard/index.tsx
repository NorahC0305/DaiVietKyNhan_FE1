"use client";

import { Badge } from "@components/Atoms/ui/badge";
import { Button } from "@components/Atoms/ui/button";
import { Card, CardContent } from "@components/Atoms/ui/card";
import Image from "next/image";
import { useState } from "react";

export default function BookCard({ book }: any) {
  const [showPreOrder, setShowPreOrder] = useState(false);

  return (
    <>
      <Card className="card-hover-effect overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 group">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image section */}
          <div className="relative overflow-hidden md:w-80 flex-shrink-0">
            <Image
              src={book?.coverImage || "/placeholder.png"}
              alt={book?.title}
              className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              fill
              sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 18vw"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {book?.originalPrice && (
              <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground shadow-lg animate-pulse">
                Giảm{" "}
                {Math.round(
                  ((book?.originalPrice - book?.price) / book?.originalPrice) * 100
                )}
                %
              </Badge>
            )}

            <div className="absolute top-4 left-4">
              <Badge
                variant="outline"
                className="bg-primary text-primary-foreground border-primary shadow-lg backdrop-blur-sm font-medium"
              >
                Đặt trước
              </Badge>
            </div>
          </div>

          {/* Content section */}
          <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-holder text-balance leading-tight group-hover:text-primary transition-colors duration-300">
                  {book?.title}
                </h3>
                {book?.subtitle && (
                  <p className="text-base text-holder font-medium">
                    {book?.subtitle}
                  </p>
                )}
                <p className="text-sm text-holder">
                  <span className="text-primary">Tác giả:</span> {book?.author}
                </p>
              </div>

              <p className="text-base text-pretty leading-relaxed text-holder">
                {book?.description}
              </p>

              {book?.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-base text-primary">
                    Đặc điểm nổi bật:
                  </h4>
                  <ul className="text-sm space-y-2">
                    {book?.features.slice(0, 4).map((feature: any) => (
                      <li
                        key={feature.id}
                        className="flex items-start space-x-3 group/item"
                      >
                        <span className="text-primary mt-1 group-hover/item:scale-125 transition-transform duration-200">
                          ✦
                        </span>
                        <span className="text-holder">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price and action section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-border/50 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-primary">
                    {book?.price.toLocaleString("vi-VN")}đ
                  </span>
                  {book?.originalPrice && (
                    <span className="text-base text-holder line-through">
                      {book?.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
                {book?.preOrderDeadline && (
                  <p className="text-sm text-holder flex items-center gap-1">
                    <span className="text-primary">⏰</span>
                    Hạn đặt trước: {book?.preOrderDeadline}
                  </p>
                )}
              </div>

              <Button
                onClick={() => setShowPreOrder(true)}
                className="btn-premium text-primary-foreground font-semibold px-8 py-3 shadow-lg text-base"
              >
                Đặt trước ngay
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* <GoogleFormModal book={book} isOpen={showPreOrder} onClose={() => setShowPreOrder(false)} /> */}
    </>
  );
}
