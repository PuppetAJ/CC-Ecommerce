'use client'

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import Image from 'next/image'

// The tile crops a 3:2 photograph to a square, so the zoom is not only bigger — it is the
// first time the visitor sees the whole frame.
export function ProductImage({
  src,
  alt,
  objectPosition,
}: {
  src: string
  alt: string
  objectPosition: string
}) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`View ${alt} larger`}
        className="group relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-tile focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          style={{ objectPosition }}
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl border-0 bg-transparent p-0 shadow-none sm:max-w-5xl"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative overflow-hidden rounded-xl">
          <Image src={src} alt={alt} width={1600} height={1067} className="h-auto w-full" />
          <DialogClose
            aria-label="Close"
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-olive-950 hover:bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <XIcon className="size-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
