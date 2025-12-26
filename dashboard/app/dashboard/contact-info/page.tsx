"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Mail, MapPin, Globe, Clock, Save, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface ContactInfo {
    phone: {
        hotline: string
        display: string
    }
    email: string
    address: {
        full: string
        street: string
        ward: string
        district: string
        city: string
        country: string
    }
    social: {
        facebook: string
        instagram: string
        youtube: string
        zalo: string
    }
    businessHours: {
        display: string
    }
    zalo: {
        phoneNumber: string
        displayName: string
    }
}

const DEFAULT_CONTACT: ContactInfo = {
    phone: { hotline: '0768426262', display: '0768 426 262' },
    email: 'audiotailoc@gmail.com',
    address: {
        full: '37/9 Đường 44, Phường Linh Đông, TP. Thủ Đức, TP.HCM',
        street: '37/9 Đường 44',
        ward: 'Phường Linh Đông',
        district: 'TP. Thủ Đức',
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
    },
    social: {
        facebook: 'https://facebook.com/audiotailoc',
        instagram: 'https://instagram.com/audiotailoc',
        youtube: 'https://youtube.com/audiotailoc',
        zalo: 'https://zalo.me/0768426262',
    },
    businessHours: { display: '08:00 - 21:00 (T2 - CN)' },
    zalo: { phoneNumber: '0768426262', displayName: 'Audio Tài Lộc' },
}

export default function ContactInfoPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchContactInfo()
    }, [])

    const fetchContactInfo = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/site/contact-info')
            setContactInfo(response.data)
        } catch (error) {
            console.error('Failed to fetch contact info:', error)
            setContactInfo(DEFAULT_CONTACT)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await apiClient.patch('/site/contact-info', contactInfo)
            toast.success("Đã lưu thông tin liên hệ")
        } catch (error) {
            console.error('Failed to save contact info:', error)
            toast.error("Không thể lưu thông tin")
        } finally {
            setSaving(false)
        }
    }

    const updateField = (path: string, value: string) => {
        setContactInfo(prev => {
            const keys = path.split('.')
            const newInfo = { ...prev }
            let current: any = newInfo

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] }
                current = current[keys[i]]
            }
            current[keys[keys.length - 1]] = value

            return newInfo
        })
    }

    if (loading) {
        return (
            <div className="space-y-6 p-4 md:p-8">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thông tin liên hệ</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin liên hệ hiển thị trên website
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchContactInfo} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Phone Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Điện thoại
                        </CardTitle>
                        <CardDescription>Số điện thoại hotline và hiển thị</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="phone-hotline">Số Hotline</Label>
                            <Input
                                id="phone-hotline"
                                value={contactInfo.phone.hotline}
                                onChange={(e) => updateField('phone.hotline', e.target.value)}
                                placeholder="0768426262"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone-display">Hiển thị</Label>
                            <Input
                                id="phone-display"
                                value={contactInfo.phone.display}
                                onChange={(e) => updateField('phone.display', e.target.value)}
                                placeholder="0768 426 262"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Email & Hours */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email & Giờ làm việc
                        </CardTitle>
                        <CardDescription>Email liên hệ và giờ làm việc</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="audiotailoc@gmail.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="hours">Giờ làm việc</Label>
                            <Input
                                id="hours"
                                value={contactInfo.businessHours.display}
                                onChange={(e) => updateField('businessHours.display', e.target.value)}
                                placeholder="08:00 - 21:00 (T2 - CN)"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Địa chỉ
                        </CardTitle>
                        <CardDescription>Địa chỉ cửa hàng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="address-full">Địa chỉ đầy đủ</Label>
                            <Textarea
                                id="address-full"
                                value={contactInfo.address.full}
                                onChange={(e) => updateField('address.full', e.target.value)}
                                placeholder="37/9 Đường 44, Phường Linh Đông, TP. Thủ Đức, TP.HCM"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="address-street">Số nhà/Đường</Label>
                                <Input
                                    id="address-street"
                                    value={contactInfo.address.street}
                                    onChange={(e) => updateField('address.street', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address-ward">Phường/Xã</Label>
                                <Input
                                    id="address-ward"
                                    value={contactInfo.address.ward}
                                    onChange={(e) => updateField('address.ward', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address-district">Quận/Huyện</Label>
                                <Input
                                    id="address-district"
                                    value={contactInfo.address.district}
                                    onChange={(e) => updateField('address.district', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address-city">Thành phố</Label>
                                <Input
                                    id="address-city"
                                    value={contactInfo.address.city}
                                    onChange={(e) => updateField('address.city', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Mạng xã hội
                        </CardTitle>
                        <CardDescription>Liên kết mạng xã hội</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="social-facebook">Facebook</Label>
                            <Input
                                id="social-facebook"
                                value={contactInfo.social.facebook}
                                onChange={(e) => updateField('social.facebook', e.target.value)}
                                placeholder="https://facebook.com/audiotailoc"
                            />
                        </div>
                        <div>
                            <Label htmlFor="social-zalo">Zalo</Label>
                            <Input
                                id="social-zalo"
                                value={contactInfo.social.zalo}
                                onChange={(e) => updateField('social.zalo', e.target.value)}
                                placeholder="https://zalo.me/0768426262"
                            />
                        </div>
                        <div>
                            <Label htmlFor="social-youtube">YouTube</Label>
                            <Input
                                id="social-youtube"
                                value={contactInfo.social.youtube}
                                onChange={(e) => updateField('social.youtube', e.target.value)}
                                placeholder="https://youtube.com/audiotailoc"
                            />
                        </div>
                        <div>
                            <Label htmlFor="social-instagram">Instagram</Label>
                            <Input
                                id="social-instagram"
                                value={contactInfo.social.instagram}
                                onChange={(e) => updateField('social.instagram', e.target.value)}
                                placeholder="https://instagram.com/audiotailoc"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Zalo Chat Widget */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            💬 Zalo Chat Widget
                        </CardTitle>
                        <CardDescription>Cấu hình Zalo Chat Widget</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="zalo-phone">Số Zalo</Label>
                                <Input
                                    id="zalo-phone"
                                    value={contactInfo.zalo.phoneNumber}
                                    onChange={(e) => updateField('zalo.phoneNumber', e.target.value)}
                                    placeholder="0768426262"
                                />
                            </div>
                            <div>
                                <Label htmlFor="zalo-name">Tên hiển thị</Label>
                                <Input
                                    id="zalo-name"
                                    value={contactInfo.zalo.displayName}
                                    onChange={(e) => updateField('zalo.displayName', e.target.value)}
                                    placeholder="Audio Tài Lộc"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
