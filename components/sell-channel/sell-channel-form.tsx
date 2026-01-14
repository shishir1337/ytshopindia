"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, User, Phone, Link as LinkIcon, DollarSign, Mail, RefreshCw, Shield, MessageCircle } from "lucide-react"

export function SellChannelForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    whatsapp: "",
    channelLink: "",
    monetizationStatus: "",
    email: "",
    expectedPrice: "",
    currency: "₹",
    captchaAnswer: "",
    agreedToTerms: false,
  })

  const [captcha, setCaptcha] = React.useState({ num1: 3, num2: 1, answer: 4 })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  // Generate new captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptcha({ num1, num2, answer: num1 + num2 })
    setFormData((prev) => ({ ...prev, captchaAnswer: "" }))
  }

  React.useEffect(() => {
    generateCaptcha()
  }, [])

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required"
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number"
    }

    if (!formData.channelLink.trim()) {
      newErrors.channelLink = "Channel link is required"
    } else if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(formData.channelLink)) {
      newErrors.channelLink = "Please enter a valid YouTube channel link"
    }

    if (!formData.monetizationStatus) {
      newErrors.monetizationStatus = "Please select monetization status"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.expectedPrice.trim()) {
      newErrors.expectedPrice = "Expected price is required"
    }

    if (!formData.captchaAnswer.trim()) {
      newErrors.captchaAnswer = "Please solve the captcha"
    } else if (parseInt(formData.captchaAnswer) !== captcha.answer) {
      newErrors.captchaAnswer = "Incorrect answer. Please try again."
      generateCaptcha()
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Mark all fields as touched on submit
      setTouched({
        name: true,
        whatsapp: true,
        channelLink: true,
        monetizationStatus: true,
        email: true,
        expectedPrice: true,
        captchaAnswer: true,
        agreedToTerms: true,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Channel Sale Request",
          channelLink: formData.channelLink,
          sellerName: formData.name,
          sellerEmail: formData.email,
          sellerWhatsapp: formData.whatsapp,
          expectedPrice: formData.expectedPrice,
          currency: formData.currency,
          monetizationStatus: formData.monetizationStatus,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Listing submitted successfully!", {
          description: "Your listing has been submitted for admin review. Redirecting to WhatsApp...",
        })
        // Reset form
        setFormData({
          name: "",
          whatsapp: "",
          channelLink: "",
          monetizationStatus: "",
          email: "",
          expectedPrice: "",
          currency: "₹",
          captchaAnswer: "",
          agreedToTerms: false,
        })
        setTouched({})
        generateCaptcha()

        // Redirect to WhatsApp URL if available
        if (data.whatsappUrl) {
          // Small delay to show the toast message
          setTimeout(() => {
            window.open(data.whatsappUrl, '_blank')
          }, 1000)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to submit listing. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting listing:", error)
      toast.error("Failed to submit listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Channel Information Section */}
      <div className="space-y-5">
        <div className="mb-4 pb-3 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Channel Information</h3>
          <p className="text-sm text-muted-foreground mt-1">Details about your YouTube channel</p>
        </div>


        {/* Channel Link */}
        <div className="space-y-2">
          <Label htmlFor="channelLink" className="flex items-center gap-2">
            <LinkIcon className="size-4 text-muted-foreground" />
            <span>Channel Link <span className="text-primary">*</span></span>
          </Label>
          <Input
            id="channelLink"
            type="url"
            placeholder="https://www.youtube.com/@yourchannel or https://youtube.com/c/yourchannel"
            value={formData.channelLink}
            onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
            onBlur={() => handleBlur("channelLink")}
            className={errors.channelLink && touched.channelLink ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">Paste your complete YouTube channel URL</p>
          {errors.channelLink && touched.channelLink && <p className="text-sm text-destructive">{errors.channelLink}</p>}
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-5 pt-6 border-t border-border">
        <div className="mb-4 pb-3 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground mt-1">Tell us about yourself</p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>Your Name <span className="text-primary">*</span></span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => handleBlur("name")}
            className={errors.name && touched.name ? "border-destructive" : ""}
          />
          {errors.name && touched.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <span>Your WhatsApp Number <span className="text-primary">*</span></span>
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            onBlur={() => handleBlur("whatsapp")}
            className={errors.whatsapp && touched.whatsapp ? "border-destructive" : ""}
          />
          <p className="text-xs text-muted-foreground">We'll contact you on this number</p>
          {errors.whatsapp && touched.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <span>Your Email <span className="text-primary">*</span></span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => handleBlur("email")}
            className={errors.email && touched.email ? "border-destructive" : ""}
          />
          {errors.email && touched.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
      </div>

      {/* Monetization Status */}
      <div className="space-y-2">
        <Label htmlFor="monetizationStatus">
          Monetization Status <span className="text-primary">*</span>
        </Label>
        <Select
          value={formData.monetizationStatus}
          onValueChange={(value) => {
            setFormData({ ...formData, monetizationStatus: value })
            handleBlur("monetizationStatus")
          }}
        >
          <SelectTrigger id="monetizationStatus" className={errors.monetizationStatus && touched.monetizationStatus ? "border-destructive" : ""}>
            <SelectValue placeholder="Select monetization status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monetized">Monetized</SelectItem>
            <SelectItem value="Non-Monetized">Non-Monetized</SelectItem>
          </SelectContent>
        </Select>
        {errors.monetizationStatus && touched.monetizationStatus && <p className="text-sm text-destructive">{errors.monetizationStatus}</p>}
      </div>

      {/* Expected Price */}
      <div className="space-y-2">
        <Label htmlFor="expectedPrice" className="flex items-center gap-2">
          <DollarSign className="size-4 text-muted-foreground" />
          <span>Expected Price <span className="text-primary">*</span></span>
        </Label>
        <div className="flex gap-2">
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="₹">₹ (INR)</SelectItem>
              <SelectItem value="$">$ (USD)</SelectItem>
              <SelectItem value="PKR">PKR (₨)</SelectItem>
              <SelectItem value="BDT">BDT (৳)</SelectItem>
              <SelectItem value="€">€ (EUR)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="expectedPrice"
            type="text"
            placeholder="Enter expected price"
            value={formData.expectedPrice}
            onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
            onBlur={() => handleBlur("expectedPrice")}
            className={`flex-1 ${errors.expectedPrice && touched.expectedPrice ? "border-destructive" : ""}`}
          />
        </div>
        {errors.expectedPrice && touched.expectedPrice && <p className="text-sm text-destructive">{errors.expectedPrice}</p>}
      </div>

      {/* Verification Section */}
      <div className="space-y-5 pt-6 border-t border-border">
        <div className="mb-4 pb-3 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span>Verification</span>
          </h3>
        </div>

        {/* Captcha */}
        <div className="space-y-2">
          <Label htmlFor="captcha">
            Are you a human? <span className="text-primary">*</span>
          </Label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 min-w-[120px]">
              <span className="text-xl font-bold text-foreground">
                {captcha.num1} + {captcha.num2} =
              </span>
            </div>
            <Input
              id="captcha"
              type="number"
              placeholder="?"
              value={formData.captchaAnswer}
              onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
              onBlur={() => handleBlur("captchaAnswer")}
              className={`w-24 ${errors.captchaAnswer && touched.captchaAnswer ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateCaptcha}
              className="flex items-center gap-2"
            >
              <RefreshCw className="size-4" />
              <span>New</span>
            </Button>
          </div>
          {errors.captchaAnswer && touched.captchaAnswer && <p className="text-sm text-destructive">{errors.captchaAnswer}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agreedToTerms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) => {
                setFormData({ ...formData, agreedToTerms: checked === true })
                handleBlur("agreedToTerms")
              }}
              className={errors.agreedToTerms && touched.agreedToTerms ? "border-destructive" : "mt-1"}
            />
            <Label
              htmlFor="agreedToTerms"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I have read and agree with the{" "}
              <a href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
              <span className="text-primary"> *</span>
            </Label>
          </div>
          {errors.agreedToTerms && touched.agreedToTerms && <p className="text-sm text-destructive ml-7">{errors.agreedToTerms}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full group"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 size-5" />
              Submit for Review
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Note: For verification and listing on our platform, sellers are required to grant us YouTube Channel Manager access. We do not request ownership access, and your channel remains fully under your control.
        </p>
      </div>
    </form>
  )
}
