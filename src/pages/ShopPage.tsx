import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addCredits } from '@/db/api';
import { toast } from 'sonner';
import { Coins, PlayCircle, Zap, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShopPage = () => {
  const { user, credits, refreshCredits } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);

  const refreshRef = useRef(refreshCredits);
  useEffect(() => {
    refreshRef.current = refreshCredits;
  }, [refreshCredits]);

  const handlePayment = async () => {
    const userId = user?.id;
    if (!userId) {
      toast.error('Identity required to access the vault!');
      return;
    }
    
    setIsProcessing(true);
    const loadingToastId = toast.loading('Connecting to Secure Payment Gateway...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const isTransactionSuccessful = await addCredits(userId, 60);
      toast.dismiss(loadingToastId);
      
      if (isTransactionSuccessful) {
        await refreshRef.current();
        window.dispatchEvent(new Event('creditsUpdated'));
        toast.success('₹29 Payment Successful! Vault replenished with 60 Credits! 💰');
      } else {
        toast.error('Payment failed at server.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.dismiss(loadingToastId);
      toast.error('Transaction error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startAd = () => {
    if (!user) {
      toast.error('Identity required to earn credits!');
      return;
    }
    setShowAd(true);
    setAdCountdown(5);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const processAdReward = async (uid: string) => {
      setShowAd(false);
      setIsProcessing(true);
      const adLoadId = toast.loading('Verifying ad completion...');

      try {
        const rewardSuccess = await addCredits(uid, 1);
        toast.dismiss(adLoadId);
        
        if (rewardSuccess) {
          await refreshRef.current();
          window.dispatchEvent(new Event('creditsUpdated'));
          toast.success("The Maestro grants you 1 Credit! ✨");
        } else {
          toast.error("Network error during reward.");
        }
      } catch (error) {
        console.error('Ad Reward Error:', error);
        toast.dismiss(adLoadId);
        toast.error("Ad reward failed.");
      } finally {
        setIsProcessing(false);
      }
    };

    if (showAd && adCountdown > 0) {
      timer = setInterval(() => setAdCountdown((prev) => prev - 1), 1000);
    } else if (showAd && adCountdown === 0 && user?.id) {
      processAdReward(user.id);
    }

    return () => clearInterval(timer);
  }, [showAd, adCountdown, user?.id]);

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full border border-primary/20 shadow-2xl">
              <Coins className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl xl:text-8xl font-black tracking-tighter gradient-text uppercase font-serif italic">
              PoetVerse Vault
            </h1>
          </div>
          <div className="flex justify-center items-center gap-3 bg-primary/10 w-fit mx-auto px-8 py-3 rounded-full border border-primary/20 shadow-inner">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-2xl font-black text-primary tracking-widest">{credits ?? 0} CREDITS</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20 group hover:scale-[1.02] transition-transform duration-500">
            <CardHeader className="border-b border-primary/10 py-6 bg-primary/5 text-center">
              <CardTitle className="text-3xl font-serif italic text-primary flex items-center justify-center gap-3">
                <PlayCircle className="w-8 h-8" /> Free Patronage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-10 space-y-8 text-center px-10">
              <p className="text-xl text-warm-muted italic font-serif leading-relaxed">
                "Endure a brief moment of commerce to earn the Maestro's favor."
              </p>
              <div className="space-y-4">
                <div className="text-4xl font-black text-primary tracking-tighter">+1 CREDIT</div>
                <Button 
                  onClick={startAd} 
                  disabled={isProcessing || showAd} 
                  className="w-full btn-royal h-16 text-xl font-bold uppercase tracking-widest rounded-2xl shadow-xl"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Watch Advertisement"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card royal-frame border-none shadow-2xl bg-primary/5 group hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Zap className="w-32 h-32 text-primary" /></div>
            <CardHeader className="border-b border-primary/20 py-6 bg-primary/10 text-center">
              <CardTitle className="text-3xl font-serif italic text-primary flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 fill-primary" /> Instant Refill
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-10 space-y-8 text-center px-10">
              <p className="text-xl text-warm-muted italic font-serif leading-relaxed">
                "For the prolific soul. Skip the wait and drench your quill in ink."
              </p>
              <div className="space-y-4">
                <div className="text-4xl font-black text-primary tracking-tighter">60 CREDITS</div>
                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing} 
                  className="w-full btn-royal h-16 text-xl font-bold uppercase tracking-widest rounded-2xl shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Unlock for ₹29"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAd && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="absolute top-6 right-6">
            <Button 
              variant="outline" 
              className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              disabled={adCountdown > 0}
              onClick={() => { if (adCountdown === 0) setShowAd(false); }}
            >
              {adCountdown > 0 ? `Reward in ${adCountdown}s` : <><X className="w-4 h-4 mr-2" /> Close Ad</>}
            </Button>
          </div>
          <div className="text-center space-y-8 max-w-2xl">
            <PlayCircle className="w-24 h-24 text-primary animate-pulse mx-auto opacity-50" />
            <h2 className="text-4xl font-black text-white uppercase tracking-widest">Sponsor Message</h2>
            <p className="text-xl text-white/50 font-serif italic">"Imagine a beautiful advertisement playing right here..."</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-8">
              <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${((5 - adCountdown) / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;