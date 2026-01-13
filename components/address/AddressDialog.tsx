"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import PhoneInput from "react-phone-input-2";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import { firestore, functions } from "@/components/FirebaseFrovider";
import MapComponent, { Coordinate } from "@/components/Map/page";

interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  district: string;
  postalCode: number;
  koordinateReceiver: { lat: number; lng: number };
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentAddress: Address | null;
}

export default function AddressDialog({
  open,
  onOpenChange,
  currentAddress,
}: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<Address>({
    id: "",
    receiverName: "",
    receiverPhone: "",
    address: "",
    district: "",
    postalCode: 0,
    koordinateReceiver: { lat: 0, lng: 0 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [koordinateReceiver, setKoordinateReceiver] = useState<Coordinate>({
    lat: 0,
    lng: 0,
  });

  // ===== prefill edit =====
  useEffect(() => {
    if (currentAddress?.id) {
      setFormData(currentAddress);
      setKoordinateReceiver(currentAddress.koordinateReceiver);
    }
  }, [currentAddress]);

  // ===== handlers =====
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.receiverName) newErrors.receiverName = "Wajib diisi";
    if (!formData.receiverPhone) newErrors.receiverPhone = "Wajib diisi";
    if (!formData.address) newErrors.address = "Wajib diisi";
    if (!formData.district) newErrors.district = "Wajib diisi";
    if (!formData.postalCode) newErrors.postalCode = "Wajib diisi";
    if (!koordinateReceiver.lat)
      newErrors.koordinate = "Koordinat wajib dipilih";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!user) return;

    const ref = collection(firestore, `customer/${user.uid}/address`);

    if (currentAddress?.id) {
      await setDoc(
        doc(firestore, `customer/${user.uid}/address/${currentAddress.id}`),
        { ...formData, koordinateReceiver },
        { merge: true },
      );
    } else {
      const res = await addDoc(ref, formData);
      await setDoc(
        doc(firestore, `customer/${user.uid}/address/${res.id}`),
        { ...formData, id: res.id, koordinateReceiver },
        { merge: true },
      );
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {currentAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="receiverName"
            placeholder="Nama penerima"
            value={formData.receiverName}
            onChange={handleChange}
          />

          <PhoneInput
            country="id"
            value={formData.receiverPhone.replace("+", "")}
            onChange={(v) => setFormData((p) => ({ ...p, receiverPhone: v }))}
            inputStyle={{ width: "100%" }}
          />

          <Textarea
            name="address"
            placeholder="Alamat lengkap"
            value={formData.address}
            onChange={handleChange}
          />

          <Input value={formData.district} disabled placeholder="Kecamatan" />
          <Input
            name="postalCode"
            placeholder="Kode pos"
            value={formData.postalCode}
            onChange={handleChange}
          />

          <MapComponent
            koordinateReceiver={koordinateReceiver}
            setKoordinateReceiver={setKoordinateReceiver}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
