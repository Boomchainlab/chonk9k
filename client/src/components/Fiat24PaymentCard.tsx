import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Fiat24PaymentCardProps {
  walletAddress?: string;
  showConnectPrompt?: boolean;
}

const Fiat24PaymentCard: React.FC<Fiat24PaymentCardProps> = ({ 
  walletAddress = '',
  showConnectPrompt = true
}) => {
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const fiat24CardData = {
    iban: 'CH63 8305 1000 0238 3873 9',
    website: 'FIAT24.COM',
    cardType: 'Tokenised Payments'
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <CardContent className="p-0">
        <div className="p-6 relative">
          {/* Card Layout */}
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-gray-600">ACCESS KEY</p>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-xs uppercase tracking-wider text-gray-600">DEBIT CARD</p>
              <div className="flex items-center justify-end space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04M12 19a9.001 9.001 0 019-9h.5a3.001 3.001 0 013 3c0 1.657-1.343 3-3 3h-.5a9.001 9.001 0 01-9 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* IBAN Number */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider text-gray-600 mb-2">SWISS IBAN ACCOUNT</p>
            <div className="flex space-x-2 items-center">
              <div className="bg-transparent text-gray-800 font-mono text-lg">
                {fiat24CardData.iban.split(' ').map((part, index) => (
                  <span key={index} className={`${index === 3 ? 'text-pink-500' : 'text-gray-800'} mr-2`}>
                    {part}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-1 text-xs text-right text-gray-500">NFT</div>
          </div>

          {/* Connected Address */}
          {walletAddress && (
            <div className="mt-4 bg-gray-100 p-2 rounded border border-gray-200">
              <p className="text-xs text-gray-500">Connected Wallet:</p>
              <p className="font-mono text-sm text-gray-700">{truncateAddress(walletAddress)}</p>
            </div>
          )}

          {/* Website */}
          <div className="mt-6 flex justify-between items-end">
            <p className="text-sm text-gray-600">{fiat24CardData.website}</p>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-800 leading-none">Fiat24</p>
              <p className="text-xs text-gray-600 rotate-90 origin-bottom-right transform translate-y-2 -translate-x-1">
                {fiat24CardData.cardType}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-100 p-4 border-t border-gray-200">
        {showConnectPrompt ? (
          <Button className="w-full bg-gradient-to-r from-primary to-[#FF8C00] text-white">
            Connect Wallet to Enable Fiat24 Payments
          </Button>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Available Balance:</p>
                <p className="text-lg font-bold">2,420.69 CHONK9K</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Equivalent:</p>
                <p className="text-lg font-bold">$1,017.48 USD</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-[#FF8C00] text-white">
              Activate Card
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Fiat24PaymentCard;