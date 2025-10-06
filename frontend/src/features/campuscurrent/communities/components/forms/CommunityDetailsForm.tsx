import { useCommunityForm } from "@/context/CommunityFormContext";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { CommunityRecruitmentStatus, CommunityType, CommunityCategory } from "@/features/campuscurrent/types/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Button } from "@/components/atoms/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/atoms/calendar";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function CommunityDetailsForm() {
  const {
    formData,
    handleInputChange,
    handleSelectChange,
    isFieldEditable,
    isEditMode,
  } = useCommunityForm();
  const { toast } = useToast();

  // State for the date picker
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Convert established string to Date when formData changes
  useEffect(() => {
    if ('established' in formData && formData.established) {
      const establishedDate = new Date(formData.established);
      if (!isNaN(establishedDate.getTime())) {
        setDate(establishedDate);
      } else {
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  }, [formData]);

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Format as YYYY-MM-DD string for backend date field
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      handleSelectChange("established", dateString);
    } else {
      handleSelectChange("established", "");
    }
  };

  const showRecruitmentLink =
    formData.recruitment_status === CommunityRecruitmentStatus.open;

  const isValidUrl = (value: string): boolean => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between">
          <Label htmlFor="name">Community Name <span className="text-red-500">*</span></Label>
          <span className="text-xs text-gray-500">
            {(formData.name || "").length} / 100
          </span>
        </div>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!isFieldEditable("name")}
          required
          minLength={3}
          maxLength={100}
          placeholder="Enter community name (3-100 characters)"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Community Type <span className="text-red-500">*</span></Label>
          <Select
            name="type"
            value={(formData as any).type || ""}
            onValueChange={(value) => handleSelectChange("type", value)}
            disabled={!isFieldEditable("type")}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select community type" />
            </SelectTrigger>
            <SelectContent className="z-[150]">
              {Object.values(CommunityType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Community Category <span className="text-red-500">*</span></Label>
          <Select
            name="category"
            value={(formData as any).category || ""}
            onValueChange={(value) => handleSelectChange("category", value)}
            disabled={!isFieldEditable("category")}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select community category" />
            </SelectTrigger>
            <SelectContent className="z-[150]">
              {Object.values(CommunityCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={(formData as any).email || ""}
          onChange={handleInputChange}
          placeholder="nuspace@nu.edu.kz"
          disabled={!isFieldEditable("email")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telegram_url">Telegram URL</Label>
          <Input
            id="telegram_url"
            name="telegram_url"
            value={formData.telegram_url}
            onChange={handleInputChange}
            disabled={!isFieldEditable("telegram_url")}
          />
        </div>
        <div>
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleInputChange}
            disabled={!isFieldEditable("instagram_url")}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="recruitment_status">Recruitment Status <span className="text-red-500">*</span></Label>
          <Select
            name="recruitment_status"
            value={formData.recruitment_status}
            onValueChange={(value) =>
              handleSelectChange("recruitment_status", value)
            }
            disabled={!isFieldEditable("recruitment_status")}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="z-[150]">
              {Object.values(CommunityRecruitmentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showRecruitmentLink && (
          <div>
            <Label htmlFor="recruitment_link">
              Recruitment Link {showRecruitmentLink && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="recruitment_link"
              name="recruitment_link"
              value={(formData as any).recruitment_link || ""}
              onChange={handleInputChange}
              placeholder="https://..."
              disabled={!isFieldEditable("recruitment_link")}
              required={showRecruitmentLink}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value && !isValidUrl(value)) {
                  toast({
                    title: "Invalid recruitment URL",
                    description: "Enter a valid URL starting with https:// or http://",
                    variant: "destructive",
                  });
                }
              }}
            />
          </div>
        )}
        {isFieldEditable("established") && (
          <div>
            <Label htmlFor="established">Established <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}

