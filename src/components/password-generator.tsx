"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type PasswordGeneratorProps = {
  initialPassword?: string;
  onPasswordGenerated: (password: string) => void;
};

export function PasswordGenerator({ initialPassword, onPasswordGenerated }: PasswordGeneratorProps) {
  const [password, setPassword] = useState(initialPassword || "");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charset = "";
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (charset === "") {
        toast({ variant: 'destructive', title: "Error", description: "Please select at least one character type." });
        return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    onPasswordGenerated(newPassword);
  };
  
  useEffect(() => {
    if(!initialPassword) {
      generatePassword();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onPasswordGenerated(e.target.value);
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={password}
        onChange={handleInputChange}
        placeholder="Generate or type a password"
        className="pr-20"
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button variant="ghost" size="icon" type="button" onClick={handleCopy} className="h-7 w-7" aria-label="Copy password"><Copy className="h-4 w-4" /></Button>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" type="button" className="h-7 w-7" aria-label="Generate new password"><RefreshCw className="h-4 w-4" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Password Generator</h4>
                        <p className="text-sm text-muted-foreground">Customize your new password.</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="length">Length</Label>
                            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">{length}</span>
                        </div>
                        <Slider id="length" max={64} min={8} step={1} value={[length]} onValueChange={(val) => setLength(val[0])} />
                        
                        <div className="grid gap-2 pt-2">
                            <div className="flex items-center space-x-2"><Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(c) => setIncludeUppercase(c as boolean)} /><Label htmlFor="uppercase">Uppercase (A-Z)</Label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(c) => setIncludeLowercase(c as boolean)} /><Label htmlFor="lowercase">Lowercase (a-z)</Label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(c) => setIncludeNumbers(c as boolean)} /><Label htmlFor="numbers">Numbers (0-9)</Label></div>
                            <div className="flex items-center space-x-2"><Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(c) => setIncludeSymbols(c as boolean)} /><Label htmlFor="symbols">Symbols (!@#)</Label></div>
                        </div>
                        
                        <Button className="mt-4 w-full" type="button" onClick={generatePassword}>Generate & Use</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
