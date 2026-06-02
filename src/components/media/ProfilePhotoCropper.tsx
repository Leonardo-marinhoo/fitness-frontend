import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cropImageToFile } from '@/lib/media/crop-image'

type ProfilePhotoCropperProps = {
  imageSrc: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => void
  onCancel: () => void
}

export function ProfilePhotoCropper({
  imageSrc,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: ProfilePhotoCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }, [imageSrc, open])

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return

    setIsSaving(true)
    try {
      const file = await cropImageToFile(imageSrc, croppedAreaPixels)
      onConfirm(file)
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="profile-photo-cropper" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Ajustar foto</DialogTitle>
          <DialogDescription>
            Arraste para centralizar e use o zoom para enquadrar seu rosto no quadrado.
          </DialogDescription>
        </DialogHeader>

        <div className="profile-photo-cropper__viewport">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>

        <label className="profile-photo-cropper__zoom">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>

        <DialogFooter className="profile-photo-cropper__actions">
          <button
            type="button"
            className="profile-photo-cropper__btn profile-photo-cropper__btn--ghost"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="profile-photo-cropper__btn profile-photo-cropper__btn--primary"
            onClick={() => void handleConfirm()}
            disabled={isSaving || !croppedAreaPixels}
          >
            {isSaving ? 'Salvando...' : 'Usar foto'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
