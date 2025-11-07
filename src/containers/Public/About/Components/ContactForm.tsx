'use client'

import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/Atoms/ui/button";
import { Input } from "@/components/Atoms/ui/input";
import { Textarea } from "@/components/Atoms/ui/textarea";

const ContactForm = () => {
  return (
    <div className="rounded-xl bg-gray-300/25 p-5 sm:p-16 border border-white/10 text-white">
      <h2 className="text-2xl sm:text-3xl font-semibold">
        Gửi tin nhắn cho chúng tôi
      </h2>
      <form className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-base text-gray-200">Họ</label>
            <Input
              className="border-white/15 placeholder-gray-300 text-white focus:ring-amber-400/70"
              placeholder=""
            />
          </div>
          <div className="space-y-2">
            <label className="text-base text-gray-200">Tên</label>
            <Input
              className="border-white/15 placeholder-gray-300 text-white focus:ring-amber-400/70"
              placeholder=""
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-base text-gray-200">Email</label>
          <Input
            type="email"
            className="border-white/15 placeholder-gray-300 text-white focus:ring-amber-400/70"
            placeholder="hello@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-base text-gray-200">Vấn đề</label>
          <Input
            className="border-white/15 placeholder-gray-300 text-white focus:ring-amber-400/70"
            placeholder=""
          />
        </div>
        <div className="space-y-2">
          <label className="text-base text-gray-200">Lời nhắn</label>
          <Textarea
            rows={4}
            className="border-white/15 placeholder-gray-300 text-white resize-y focus:ring-amber-400/70 bg-black/30"
            placeholder="Để lại lời nhắn tại đây"
          />
        </div>
        <div>
          <Button
            type="button"
            size="full"
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
          >
            Gửi lời nhắn
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
