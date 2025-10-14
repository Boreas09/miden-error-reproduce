import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const MAX_FILE_SIZE = 1024 * 1024 // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Maximum file size is 1MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  twitter: z.string().optional(),
  github: z.string().optional(),
  discord: z.string().optional(),
  telegram: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function Identity() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Mock data - replace with actual data from blockchain/API
  const domainPurchaseDate = new Date("2024-03-15")
  const lastModifiedDate = new Date()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twitter: "",
      github: "",
      discord: "",
      telegram: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check dimensions
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      setImageDimensions({ width, height })

      if (width > 512 || height > 512) {
        form.setError("image", {
          message: "Image dimensions must be maximum 512x512 pixels",
        })
        setImagePreview(null)
      } else {
        form.clearErrors("image")
        setImagePreview(URL.createObjectURL(file))
        form.setValue("image", file)
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageDimensions(null)
    form.setValue("image", undefined)
    form.clearErrors("image")
  }

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data)
    // TODO: Submit to blockchain/API
  }

  return (
    <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl">
        <div className="space-y-2 mb-6 text-center">
          <h1 className="luckiest-guy-regular text-2xl sm:text-3xl md:text-4xl font-bold md:tracking-tight">
            Your Miden Identity
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-2">
            Manage your Miden identity and connected services.
          </p>
        </div>

        <Card className="p-4 sm:p-6 bg-gray-50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {imageDimensions && (
                              <p className="text-xs text-muted-foreground mt-2 text-center">
                                {imageDimensions.width}x{imageDimensions.height}px
                              </p>
                            )}
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">Upload Image</span>
                            <input
                              type="file"
                              className="hidden"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Maximum 512x512 pixels, 1MB size
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Media Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Media Accounts (Optional)</h3>

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord</FormLabel>
                      <FormControl>
                        <Input placeholder="username#0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Domain Info */}
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-medium">Domain Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Purchase Date</p>
                    <p className="font-medium">{domainPurchaseDate.toLocaleDateString('en-US')}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Last Modified</p>
                    <p className="font-medium">{lastModifiedDate.toLocaleDateString('en-US')}</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </Form>
        </Card>

        <div className="min-h-[40px]">
          {/* Spacer */}
        </div>
      </div>
    </main>
  )
}