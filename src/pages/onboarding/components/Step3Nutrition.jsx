import { motion } from "motion/react";
import { Select } from "../../../components/ui/Input";
import ChipSelect from "../../../components/ui/ChipSelect";
import TagInput from "../../../components/ui/TagInput";
import {
  ALLERGY_OPTIONS,
  FEEDING_OPTIONS,
  NO_ALLERGY,
} from "../../../constants/childOptions";

export default function Step3Nutrition({
  values,
  errors,
  onChange,
  setValue,
}) {
  const noAllergy = values.allergies.includes(NO_ALLERGY);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      <Select
        label="Pola Pemberian Makan"
        name="feedingType"
        options={FEEDING_OPTIONS}
        value={values.feedingType}
        onChange={onChange}
        error={errors.feedingType}
      />

      <ChipSelect
        label="Alergi Makanan"
        options={ALLERGY_OPTIONS}
        exclusiveValue={NO_ALLERGY}
        value={values.allergies}
        onChange={(v) => setValue("allergies", v)}
        error={errors.allergies}
      />

      <TagInput
        label="Alergi lainnya"
        placeholder="Ketik lalu tekan Enter"
        disabled={noAllergy}
        value={values.otherAllergies}
        onChange={(v) => setValue("otherAllergies", v)}
      />

      <TagInput
        label="Makanan yang disukai"
        placeholder="Contoh: pisang, tahu, bubur ayam"
        hint="Tekan Enter atau koma untuk menambahkan."
        value={values.favoriteFoods}
        onChange={(v) => setValue("favoriteFoods", v)}
      />

      <TagInput
        label="Makanan yang tidak disukai"
        placeholder="Contoh: sayur pahit, hati ayam"
        value={values.dislikedFoods}
        onChange={(v) => setValue("dislikedFoods", v)}
      />
    </motion.div>
  );
}