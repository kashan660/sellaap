'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/actions/settings';
import { getPaymentSettings, updatePaymentSettings } from '@/lib/actions/payment-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Loader2, CreditCard, Globe, Share2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    defaultKeywords: '',
    ogImage: '',
    twitterHandle: '',
    googleVerification: '',
    bingVerification: ''
  });

  const [paymentData, setPaymentData] = useState({
    paypalEmail: '',
    isPaypalEnabled: false,
    payoneerDetails: '',
    isPayoneerEnabled: false,
    wiseDetails: '',
    isWiseEnabled: false,
    btcAddress: '',
    isBtcEnabled: false,
    binancePayId: '',
    isBinanceEnabled: false,
    usdtAddress: '',
    isUsdtEnabled: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [seoData, paymentRes] = await Promise.all([
        getSettings(),
        getPaymentSettings()
      ]);

      if (seoData) {
        setFormData({
            siteTitle: seoData.siteTitle || '',
            siteDescription: seoData.siteDescription || '',
            defaultKeywords: seoData.defaultKeywords || '',
            ogImage: seoData.ogImage || '',
            twitterHandle: seoData.twitterHandle || '',
            googleVerification: seoData.googleVerification || '',
            bingVerification: seoData.bingVerification || ''
        });
      }

      if (paymentRes.success && paymentRes.settings) {
        setPaymentData({
          paypalEmail: paymentRes.settings.paypalEmail || '',
          isPaypalEnabled: paymentRes.settings.isPaypalEnabled,
          payoneerDetails: paymentRes.settings.payoneerDetails || '',
          isPayoneerEnabled: paymentRes.settings.isPayoneerEnabled,
          wiseDetails: paymentRes.settings.wiseDetails || '',
          isWiseEnabled: paymentRes.settings.isWiseEnabled,
          btcAddress: paymentRes.settings.btcAddress || '',
          isBtcEnabled: paymentRes.settings.isBtcEnabled,
          binancePayId: paymentRes.settings.binancePayId || '',
          isBinanceEnabled: paymentRes.settings.isBinanceEnabled,
          usdtAddress: paymentRes.settings.usdtAddress || '',
          isUsdtEnabled: paymentRes.settings.isUsdtEnabled,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Prepare Payment FormData
      const paymentFormData = new FormData();
      paymentFormData.append('paypalEmail', paymentData.paypalEmail);
      if (paymentData.isPaypalEnabled) paymentFormData.append('isPaypalEnabled', 'on');
      
      paymentFormData.append('payoneerDetails', paymentData.payoneerDetails);
      if (paymentData.isPayoneerEnabled) paymentFormData.append('isPayoneerEnabled', 'on');
      
      paymentFormData.append('wiseDetails', paymentData.wiseDetails);
      if (paymentData.isWiseEnabled) paymentFormData.append('isWiseEnabled', 'on');
      
      paymentFormData.append('btcAddress', paymentData.btcAddress);
      if (paymentData.isBtcEnabled) paymentFormData.append('isBtcEnabled', 'on');
      
      paymentFormData.append('binancePayId', paymentData.binancePayId);
      if (paymentData.isBinanceEnabled) paymentFormData.append('isBinanceEnabled', 'on');
      
      paymentFormData.append('usdtAddress', paymentData.usdtAddress);
      if (paymentData.isUsdtEnabled) paymentFormData.append('isUsdtEnabled', 'on');

      const [seoResult, paymentResult] = await Promise.all([
        updateSettings(formData),
        updatePaymentSettings(paymentFormData)
      ]);

      if (seoResult.success && paymentResult.success) {
        alert('All settings saved successfully!');
      } else {
        const errorMsg = [seoResult.error, paymentResult.error].filter(Boolean).join(', ');
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage global site settings, SEO, and payments.</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={formData.siteTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, siteTitle: e.target.value }))}
                placeholder="Sellaap - Premium Digital Goods"
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription">Meta Description</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                placeholder="Your trusted source for..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="defaultKeywords">Default Keywords (comma separated)</Label>
              <Textarea
                id="defaultKeywords"
                value={formData.defaultKeywords}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultKeywords: e.target.value }))}
                placeholder="iptv, firestick, digital goods"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social & Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Social Share Image (OG Image)</Label>
              <div className="mt-2">
                <ImageUpload
                    onImageUpload={(img) => setFormData(prev => ({ ...prev, ogImage: img.url }))}
                />
                {formData.ogImage && (
                    <div className="mt-2 p-2 border rounded bg-muted/20">
                        <p className="text-xs text-muted-foreground mb-1">Current Image:</p>
                        <img src={formData.ogImage} alt="OG Preview" className="h-20 object-contain" />
                    </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input
                id="twitterHandle"
                value={formData.twitterHandle}
                onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value }))}
                placeholder="@sellaap"
              />
            </div>

            <div>
              <Label htmlFor="googleVerification">Google Verification Code</Label>
              <Input
                id="googleVerification"
                value={formData.googleVerification}
                onChange={(e) => setFormData(prev => ({ ...prev, googleVerification: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bingVerification">Bing Verification Code</Label>
              <Input
                id="bingVerification"
                value={formData.bingVerification}
                onChange={(e) => setFormData(prev => ({ ...prev, bingVerification: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PayPal */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">PayPal</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPaypalEnabled"
                      checked={paymentData.isPaypalEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isPaypalEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPaypalEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    value={paymentData.paypalEmail}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    placeholder="paypal@example.com"
                  />
                </div>
              </div>

              {/* Payoneer */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Payoneer</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPayoneerEnabled"
                      checked={paymentData.isPayoneerEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isPayoneerEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPayoneerEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoneerDetails">Payoneer Details</Label>
                  <Textarea
                    id="payoneerDetails"
                    value={paymentData.payoneerDetails}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, payoneerDetails: e.target.value }))}
                    placeholder="Account details for Payoneer transfer..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Wise */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Wise</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isWiseEnabled"
                      checked={paymentData.isWiseEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isWiseEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isWiseEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wiseDetails">Wise Details</Label>
                  <Textarea
                    id="wiseDetails"
                    value={paymentData.wiseDetails}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, wiseDetails: e.target.value }))}
                    placeholder="Account details for Wise transfer..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Bitcoin */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Bitcoin (BTC)</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isBtcEnabled"
                      checked={paymentData.isBtcEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isBtcEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isBtcEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btcAddress">BTC Address</Label>
                  <Input
                    id="btcAddress"
                    value={paymentData.btcAddress}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, btcAddress: e.target.value }))}
                    placeholder="Wallet address"
                  />
                </div>
              </div>

              {/* Binance Pay */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Binance Pay</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isBinanceEnabled"
                      checked={paymentData.isBinanceEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isBinanceEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isBinanceEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="binancePayId">Binance Pay ID</Label>
                  <Input
                    id="binancePayId"
                    value={paymentData.binancePayId}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, binancePayId: e.target.value }))}
                    placeholder="Binance Pay ID"
                  />
                </div>
              </div>

              {/* USDT (TRC20) */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">USDT (TRC20)</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isUsdtEnabled"
                      checked={paymentData.isUsdtEnabled}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, isUsdtEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isUsdtEnabled">Enable</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usdtAddress">USDT Address</Label>
                  <Input
                    id="usdtAddress"
                    value={paymentData.usdtAddress}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, usdtAddress: e.target.value }))}
                    placeholder="TRC20 Address"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
