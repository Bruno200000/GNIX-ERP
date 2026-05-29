'use client'

import { useState } from "react"
import Image from "next/image"
import { Camera, Upload } from "lucide-react"

export function PhotoFileInput({
  name,
  label = "Photo",
  shape = "rounded-2xl",
}: {
  name: string
  label?: string
  shape?: string
}) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <label className={`relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-indigo-400 ${shape}`}>
      {preview ? (
        <Image src={preview} alt={label} fill className="object-cover" />
      ) : (
        <>
          <Camera className="h-8 w-8 text-slate-300" />
          <span className="text-[10px] font-bold uppercase text-slate-400">{label}</span>
        </>
      )}
      <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
        <Upload className="h-3 w-3" />
      </span>
      <input
        name={name}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          setPreview(file ? URL.createObjectURL(file) : null)
        }}
      />
    </label>
  )
}
