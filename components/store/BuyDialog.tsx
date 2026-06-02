"use client";

import { useState } from "react";
import Image from "next/image";
import { Comic } from "@/lib/comics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StkPushForm } from "@/components/stk/StkPushForm";
import { PaymentLinkForm } from "@/components/payment-links/PaymentLinkForm";

interface BuyDialogProps {
  comic: Comic;
}

export function BuyDialog({ comic }: BuyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Buy Now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <Image
                src={comic.cover}
                alt={comic.title}
                width={40}
                height={40}
                className="rounded object-cover"
              />
              {comic.title}
            </DialogTitle>
            <DialogDescription>
              {comic.issue} · KES {comic.price.toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-6 pb-6">
            <Tabs defaultValue="stk">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stk">M-Pesa STK Push</TabsTrigger>
                <TabsTrigger value="link">Payment Link</TabsTrigger>
              </TabsList>

              <TabsContent value="stk" className="mt-4">
                <StkPushForm
                  defaultAmount={comic.price}
                  comicTitle={`${comic.title} – ${comic.issue}`}
                />
              </TabsContent>

              <TabsContent value="link" className="mt-4">
                <PaymentLinkForm
                  defaultAmount={comic.price}
                  defaultNote={`${comic.title} – ${comic.issue}`}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
