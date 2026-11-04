"""Kontrak API (Pydantic v2). Semua field opsional faktor risiko boleh kosong: model meng-impute."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

Gender = Literal["M", "F"]


class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ZScoreRequest(_Strict):
    child_age_months: int = Field(..., ge=0, le=60, examples=[14])
    gender: Gender = Field(..., examples=["F"])
    height_cm: Optional[float] = Field(None, gt=35, lt=130)
    weight_kg: Optional[float] = Field(None, gt=1, lt=35)

    @model_validator(mode="after")
    def _need_measure(self):
        if self.height_cm is None and self.weight_kg is None:
            raise ValueError("isi minimal height_cm atau weight_kg")
        return self


class AssessRequest(_Strict):
    child_age_months: int = Field(..., ge=0, le=59, examples=[14])
    gender: Gender = Field(..., examples=["F"])
    height_cm: Optional[float] = Field(None, gt=35, lt=130, description="Tinggi/panjang badan saat ini")
    weight_kg: Optional[float] = Field(None, gt=1, lt=35, description="Berat badan saat ini")
    birth_length_cm: Optional[float] = Field(None, gt=35, lt=60)
    birth_weight_kg: Optional[float] = Field(None, gt=0.5, lt=6)
    mother_age: Optional[float] = Field(None, ge=12, le=60)
    mother_education: Optional[Literal["No Education", "Elementary/Middle School", "High School", "University"]] = None
    mother_height_cm: Optional[float] = Field(None, gt=120, lt=200)
    anc_visits: Optional[int] = Field(None, ge=0, le=20)
    exclusive_breastfeeding: Optional[Literal["Yes", "No"]] = None
    complementary_feeding_start_months: Optional[float] = Field(None, ge=0, le=24)
    immunization: Optional[Literal["Complete", "Incomplete", "Not Immunized"]] = None
    diarrhea_frequency: Optional[int] = Field(None, ge=0, le=30)
    drinking_water_source: Optional[Literal["Protected", "Unprotected"]] = None
    sanitation: Optional[Literal["Improved", "Unimproved"]] = None
    economic_level: Optional[Literal["Low", "Middle", "High"]] = None
    residence_type: Optional[Literal["Urban", "Rural"]] = None
    deworming: Optional[Literal["Yes", "No"]] = None

    @model_validator(mode="after")
    def _check(self):
        if self.height_cm is not None and self.birth_length_cm is not None and self.height_cm < self.birth_length_cm:
            raise ValueError("height_cm tidak boleh lebih kecil dari birth_length_cm")
        return self


class ChildProfile(_Strict):
    name: Optional[str] = Field(None, max_length=60, description="Nama panggilan; kirim hanya jika user setuju")
    age_months: Optional[int] = Field(None, ge=0, le=72)
    gender: Optional[Gender] = None
    allergies: list[str] = Field(default_factory=list, max_length=15)
    food_preferences: list[str] = Field(default_factory=list, max_length=15)


class HistoryItem(_Strict):
    role: Literal["user", "assistant"]
    text: str = Field(..., max_length=2000)


class ChatRequest(_Strict):
    question: str = Field(..., min_length=2, max_length=1000, examples=["Anakku 14 bulan susah makan, harus gimana?"])
    child_profile: Optional[ChildProfile] = None
    growth_input: Optional[AssessRequest] = None
    history: list[HistoryItem] = Field(default_factory=list, max_length=10)


class SourceDetail(BaseModel):
    title: str
    reference: str
    url: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    actions: list[str]
    sources: list[str]
    source_details: list[SourceDetail]
    refer_to_professional: bool
    route: str
    disclaimer: str
    prompt_version: str
    request_id: str
    degraded: bool = Field(False, description="true jika LLM gagal dan jawaban adalah fallback aman")
    debug: Optional[dict] = None
