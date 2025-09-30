'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Target,
  Heart
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Năm kinh nghiệm', value: '10+', icon: Clock },
    { label: 'Dự án hoàn thành', value: '500+', icon: CheckCircle },
    { label: 'Khách hàng hài lòng', value: '1000+', icon: Users },
    { label: 'Giải thưởng', value: '25+', icon: Award }
  ];

  const values = [
    {
      icon: Target,
      title: 'Chất lượng vượt trội',
      description: 'Cam kết mang đến sản phẩm và dịch vụ chất lượng cao nhất cho khách hàng.'
    },
    {
      icon: Heart,
      title: 'Khách hàng là trung tâm',
      description: 'Luôn đặt lợi ích và sự hài lòng của khách hàng lên hàng đầu.'
    },
    {
      icon: Star,
      title: 'Đổi mới liên tục',
      description: 'Không ngừng nghiên cứu và áp dụng công nghệ mới nhất trong ngành.'
    },
    {
      icon: Users,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm và được đào tạo chuyên nghiệp.'
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'Giám đốc kỹ thuật',
      experience: '15 năm',
      specialties: ['Hệ thống âm thanh hội trường', 'Thiết kế phòng thu']
    },
    {
      name: 'Trần Thị B',
      position: 'Kỹ sư âm thanh',
      experience: '8 năm',
      specialties: ['Live sound', 'Studio recording']
    },
    {
      name: 'Lê Văn C',
      position: 'Chuyên viên tư vấn',
      experience: '12 năm',
      specialties: ['Tư vấn giải pháp', 'Dự án sân khấu']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Về Audio Tài Lộc
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Chúng tôi là đơn vị hàng đầu trong lĩnh vực cung cấp thiết bị âm thanh
                chuyên nghiệp và dịch vụ kỹ thuật âm thanh tại Việt Nam.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg">Liên hệ ngay</Button>
                <Button variant="outline" size="lg">Xem dự án</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Câu chuyện của chúng tôi
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground">
                    Audio Tài Lộc được thành lập từ năm 2014 với sứ mệnh mang đến
                    những giải pháp âm thanh chất lượng cao cho thị trường Việt Nam.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Với đội ngũ kỹ thuật viên giàu kinh nghiệm và am hiểu sâu sắc
                    về thị trường, chúng tôi đã trở thành đối tác tin cậy của hàng
                    trăm khách hàng từ cá nhân đến doanh nghiệp lớn.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Chúng tôi không chỉ cung cấp thiết bị mà còn mang đến dịch vụ
                    tư vấn, lắp đặt và bảo hành chuyên nghiệp, đảm bảo khách hàng
                    luôn hài lòng với sản phẩm và dịch vụ của chúng tôi.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <div className="text-6xl">🎵</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những giá trị mà chúng tôi luôn hướng tới và duy trì trong mọi hoạt động
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Đội ngũ kỹ thuật viên giàu kinh nghiệm, luôn sẵn sàng hỗ trợ khách hàng
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <div className="text-2xl">👤</div>
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-muted-foreground">{member.position}</p>
                    <Badge variant="secondary">{member.experience} kinh nghiệm</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">Chuyên môn:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-muted-foreground">
                    123 Đường ABC, Quận XYZ<br />
                    TP.HCM, Việt Nam
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Điện thoại</h3>
                  <p className="text-muted-foreground">
                    +84 123 456 789<br />
                    +84 987 654 321
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    info@audiotailoc.com<br />
                    support@audiotailoc.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}