"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@components/Atoms/ui/button";
import { Input } from "@components/Atoms/ui/input";
import TipTapEditor from "@components/Organisms/Tiptap";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/Atoms/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/Atoms/ui/select";
import LucideIcon from "@components/Atoms/LucideIcon";
import {
  Upload,
  Plus,
  Save,
  Trash2,
  Eye,
  Filter,
  GripVertical,
  FileText,
  BookOpen,
} from "lucide-react";
import kynhanService from "@services/kynhan";
import KyNhanSelect from "@components/Atoms/KyNhanSelect";
import { useForm, Controller } from "react-hook-form";
import chiTietKyNhanService from "@services/chi-tiet-ky-nhan";
import { toast } from "react-toastify";

interface ImageInfo {
  id: string;
  title: string;
  summary: string;
  shortDescription: string;
}

interface SectionInfo {
  id: string;
  title: string;
  content: string;
  nguon?: string;
}

interface HistorySentence {
  id: string;
  content: string;
  source: string;
  tacGia?: string;
}

interface HistorySection {
  id: string;
  title: string;
  sentences: HistorySentence[];
}

interface FolkloreSection {
  id: string;
  title: string;
  content: string;
  source: string;
}

interface ReferenceSection {
  id: string;
  content: string;
}

interface ImageLibrary {
  id: string;
  file: File | null;
  preview: string;
  mediaData?: any; // Store original media data for reference
}

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const CardStoryPage = ({ chiTietKyNhan }: { chiTietKyNhan?: any }) => {
  const [libraryImage, setLibraryImage] = useState<File | null>(null);
  const [backgroundRemovedImage, setBackgroundRemovedImage] =
    useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo>({
    id: "",
    title: "",
    summary: "",
    shortDescription: "",
  });
  const [basicInfo, setBasicInfo] = useState<SectionInfo[]>([
    { id: "1", title: "", content: "", nguon: "" },
  ]);
  const [historicalInfo, setHistoricalInfo] = useState<SectionInfo[]>([
    { id: "1", title: "", content: "", nguon: "" },
  ]);
  const [historySections, setHistorySections] = useState<HistorySection[]>([
    {
      id: "1",
      title: "",
      sentences: [{ id: "1", content: "", source: "", tacGia: "" }],
    },
  ]);
  const [folkloreSections, setFolkloreSections] = useState<FolkloreSection[]>([
    { id: "1", title: "", content: "", source: "" },
  ]);
  const [referenceSections, setReferenceSections] = useState<
    ReferenceSection[]
  >([{ id: "1", content: "" }]);
  const [imageLibraries, setImageLibraries] = useState<ImageLibrary[]>([]);
  const [draggedItem, setDraggedItem] = useState<{
    id: string;
    type: "basic" | "historical" | "history" | "folklore" | "reference";
  } | null>(null);

  const handleImageUpload = (
    type: "library" | "background" | "imageLibrary",
    sectionId?: string
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = type === "imageLibrary";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        if (type === "imageLibrary") {
          processMultipleImageFiles(files, type);
        } else {
          processImageFile(files[0], type, sectionId);
        }
      }
    };
    input.click();
  };

  const processImageFile = (
    file: File,
    type: "library" | "background" | "imageLibrary",
    sectionId?: string
  ) => {
    if (file && file.type.startsWith("image/")) {
      if (type === "library") {
        setLibraryImage(file);
      } else if (type === "background") {
        setBackgroundRemovedImage(file);
      } else if (type === "imageLibrary" && sectionId) {
        setImageLibraries((prev) =>
          prev.map((img) =>
            img.id === sectionId
              ? { ...img, file, preview: URL.createObjectURL(file) }
              : img
          )
        );
      }
    }
  };

  const processMultipleImageFiles = (files: File[], type: "imageLibrary") => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0 && type === "imageLibrary") {
      const newImageSections = imageFiles.map((file) => ({
        id:
          Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));

      setImageLibraries((prev) => {
        // Giữ lại tất cả items có file hoặc preview, sau đó thêm các file mới
        const existingItems = prev.filter((item) => {
          const hasFile = item.file !== null && item.file !== undefined;
          const hasPreview = item.preview && item.preview.trim() !== "";
          return hasFile || hasPreview;
        });

        return [...existingItems, ...newImageSections];
      });
    }
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50", "border-blue-400");
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");
  };

  const handleImageDrop = (
    e: React.DragEvent,
    type: "library" | "background" | "imageLibrary",
    sectionId?: string
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      if (type === "imageLibrary") {
        processMultipleImageFiles(imageFiles, type);
      } else {
        processImageFile(imageFiles[0], type, sectionId);
      }
    }
  };

  const addSection = (
    type:
      | "basic"
      | "historical"
      | "history"
      | "folklore"
      | "reference"
      | "imageLibrary"
  ) => {
    const id = Date.now().toString();

    if (type === "basic") {
      const newSection: SectionInfo = { id, title: "", content: "" };
      setBasicInfo([...basicInfo, newSection]);
    } else if (type === "historical") {
      const newSection: SectionInfo = { id, title: "", content: "" };
      setHistoricalInfo([...historicalInfo, newSection]);
    } else if (type === "history") {
      const newSection: HistorySection = {
        id,
        title: "",
        sentences: [
          { id: Date.now().toString() + "_1", content: "", source: "" },
        ],
      };
      setHistorySections([...historySections, newSection]);
    } else if (type === "folklore") {
      const newSection: FolkloreSection = {
        id,
        title: "",
        content: "",
        source: "",
      };
      setFolkloreSections([...folkloreSections, newSection]);
    } else if (type === "reference") {
      const newSection: ReferenceSection = { id, content: "" };
      setReferenceSections([...referenceSections, newSection]);
    } else if (type === "imageLibrary") {
      // Don't add empty image library sections, use upload button instead
      handleImageUpload("imageLibrary");
    }
  };

  const addHistorySentence = (sectionId: string) => {
    const newSentence: HistorySentence = {
      id: Date.now().toString(),
      content: "",
      source: "",
      tacGia: "",
    };
    setHistorySections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, sentences: [...section.sentences, newSentence] }
          : section
      )
    );
  };

  const updateSection = (
    type: "basic" | "historical" | "history" | "folklore" | "reference",
    id: string,
    field: "title" | "content" | "source" | "nguon",
    value: string
  ) => {
    setHasInteracted(true);
    // Mark this specific field as touched
    const fieldKey = `${type}-${id}-${field}`;
    setTouchedFields((prev) => new Set([...prev, fieldKey]));

    if (type === "basic") {
      setBasicInfo(
        basicInfo.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    } else if (type === "historical") {
      setHistoricalInfo(
        historicalInfo.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    } else if (type === "history") {
      setHistorySections(
        historySections.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    } else if (type === "folklore") {
      setFolkloreSections(
        folkloreSections.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    } else if (type === "reference") {
      setReferenceSections(
        referenceSections.map((section) =>
          section.id === id ? { ...section, [field]: value } : section
        )
      );
    }
  };

  const updateHistorySentence = (
    sectionId: string,
    sentenceId: string,
    field: "content" | "source" | "tacGia",
    value: string
  ) => {
    setHasInteracted(true);
    // Mark this specific field as touched
    const fieldKey = `history-${sectionId}-${sentenceId}-${field}`;
    setTouchedFields((prev) => new Set([...prev, fieldKey]));

    setHistorySections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              sentences: section.sentences.map((sentence) =>
                sentence.id === sentenceId
                  ? { ...sentence, [field]: value }
                  : sentence
              ),
            }
          : section
      )
    );
  };

  const removeSection = (
    type:
      | "basic"
      | "historical"
      | "history"
      | "folklore"
      | "reference"
      | "imageLibrary",
    id: string
  ) => {
    if (type === "basic") {
      setBasicInfo(basicInfo.filter((section) => section.id !== id));
    } else if (type === "historical") {
      setHistoricalInfo(historicalInfo.filter((section) => section.id !== id));
    } else if (type === "history") {
      setHistorySections(
        historySections.filter((section) => section.id !== id)
      );
    } else if (type === "folklore") {
      setFolkloreSections(
        folkloreSections.filter((section) => section.id !== id)
      );
    } else if (type === "reference") {
      setReferenceSections(
        referenceSections.filter((section) => section.id !== id)
      );
    } else if (type === "imageLibrary") {
      setImageLibraries(imageLibraries.filter((image) => image.id !== id));
    }
  };

  const removeHistorySentence = (sectionId: string, sentenceId: string) => {
    setHistorySections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              sentences: section.sentences.filter(
                (sentence) => sentence.id !== sentenceId
              ),
            }
          : section
      )
    );
  };

  const handleDragStart = (
    e: React.DragEvent,
    id: string,
    type: "basic" | "historical" | "history" | "folklore" | "reference"
  ) => {
    setDraggedItem({ id, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    targetId: string,
    type: "basic" | "historical" | "history" | "folklore" | "reference"
  ) => {
    e.preventDefault();

    if (
      !draggedItem ||
      draggedItem.type !== type ||
      draggedItem.id === targetId
    ) {
      setDraggedItem(null);
      return;
    }

    if (type === "basic") {
      const draggedIndex = basicInfo.findIndex(
        (section) => section.id === draggedItem.id
      );
      const targetIndex = basicInfo.findIndex(
        (section) => section.id === targetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newBasicInfo = [...basicInfo];
        const [draggedSection] = newBasicInfo.splice(draggedIndex, 1);
        newBasicInfo.splice(targetIndex, 0, draggedSection);
        setBasicInfo(newBasicInfo);
      }
    } else if (type === "historical") {
      const draggedIndex = historicalInfo.findIndex(
        (section) => section.id === draggedItem.id
      );
      const targetIndex = historicalInfo.findIndex(
        (section) => section.id === targetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newHistoricalInfo = [...historicalInfo];
        const [draggedSection] = newHistoricalInfo.splice(draggedIndex, 1);
        newHistoricalInfo.splice(targetIndex, 0, draggedSection);
        setHistoricalInfo(newHistoricalInfo);
      }
    } else if (type === "history") {
      const draggedIndex = historySections.findIndex(
        (section) => section.id === draggedItem.id
      );
      const targetIndex = historySections.findIndex(
        (section) => section.id === targetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newHistorySections = [...historySections];
        const [draggedSection] = newHistorySections.splice(draggedIndex, 1);
        newHistorySections.splice(targetIndex, 0, draggedSection);
        setHistorySections(newHistorySections);
      }
    } else if (type === "folklore") {
      const draggedIndex = folkloreSections.findIndex(
        (section) => section.id === draggedItem.id
      );
      const targetIndex = folkloreSections.findIndex(
        (section) => section.id === targetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newFolkloreSections = [...folkloreSections];
        const [draggedSection] = newFolkloreSections.splice(draggedIndex, 1);
        newFolkloreSections.splice(targetIndex, 0, draggedSection);
        setFolkloreSections(newFolkloreSections);
      }
    } else if (type === "reference") {
      const draggedIndex = referenceSections.findIndex(
        (section) => section.id === draggedItem.id
      );
      const targetIndex = referenceSections.findIndex(
        (section) => section.id === targetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newReferenceSections = [...referenceSections];
        const [draggedSection] = newReferenceSections.splice(draggedIndex, 1);
        newReferenceSections.splice(targetIndex, 0, draggedSection);
        setReferenceSections(newReferenceSections);
      }
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const [selectedKyNhanId, setSelectedKyNhanId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const kyNhanSelectRef = useRef<HTMLDivElement>(null);

  type FormValues = {
    kyNhanId: number | null;
    thamKhao: string;
    boiCanhLichSuVaXuatThan: string;
    suSachVietGi: string;
    giaiThoaiDanGian: string;
    thuVienAnh: File[];
  };

  const form = useForm<FormValues>({
    defaultValues: {
      kyNhanId: chiTietKyNhan?.kyNhanId || null,
      thamKhao: "",
      boiCanhLichSuVaXuatThan: "",
      suSachVietGi: "",
      giaiThoaiDanGian: "",
      thuVienAnh: [],
    },
    mode: "onChange",
  });

  // Handle form errors
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change" && name === "kyNhanId" && !value.kyNhanId) {
        // If kyNhanId becomes null/undefined, scroll to it
        setTimeout(() => {
          if (kyNhanSelectRef.current) {
            kyNhanSelectRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Fill data from chiTietKyNhan when component mounts
  useEffect(() => {
    if (chiTietKyNhan) {
      // Set selected ky nhan
      setSelectedKyNhanId(chiTietKyNhan.kyNhanId);

      // Fill historical info (boiCanhLichSuVaSuuThan)
      if (
        chiTietKyNhan.boiCanhLichSuVaSuuThan &&
        chiTietKyNhan.boiCanhLichSuVaSuuThan.length > 0
      ) {
        const historicalSections = chiTietKyNhan.boiCanhLichSuVaSuuThan.map(
          (item: any, index: number) => ({
            id: item.id?.toString() || `historical-${index + 1}`,
            title: item.tieuDe || "",
            content: item.noiDung || "",
            nguon: item.nguon || "",
          })
        );
        setHistoricalInfo(historicalSections);
      }

      // Fill history sections (suSachVietGi)
      if (chiTietKyNhan.suSachVietGi && chiTietKyNhan.suSachVietGi.length > 0) {
        const historySections = chiTietKyNhan.suSachVietGi.map(
          (item: any, index: number) => ({
            id: item.id?.toString() || `history-${index + 1}`,
            title: item.tieuDe || "",
            sentences: [
              {
                id: `sentence-${index + 1}`,
                content: item.doanVan || "",
                source: item.nguonSach || "",
                tacGia: item.tacGia || "",
              },
            ],
          })
        );
        setHistorySections(historySections);
      }

      // Fill folklore sections (giaiThoaiDanGian)
      if (
        chiTietKyNhan.giaiThoaiDanGian &&
        chiTietKyNhan.giaiThoaiDanGian.length > 0
      ) {
        const folkloreSections = chiTietKyNhan.giaiThoaiDanGian.map(
          (item: any, index: number) => ({
            id: item.id?.toString() || `folklore-${index + 1}`,
            title: item.tieuDe || "",
            content: item.noiDung || "",
            source: item.nguon || "",
          })
        );
        setFolkloreSections(folkloreSections);
      }

      // Fill reference sections (thamKhao)
      if (chiTietKyNhan.thamKhao && chiTietKyNhan.thamKhao.trim()) {
        const referenceSections = [
          {
            id: "reference-1",
            content: chiTietKyNhan.thamKhao,
          },
        ];
        setReferenceSections(referenceSections);
      }

      // Fill media if available (only if no existing images)
      if (chiTietKyNhan.media && chiTietKyNhan.media.length > 0) {
        // Convert media URLs to imageLibraries format
        const mediaSections = chiTietKyNhan.media.map((mediaItem: any) => ({
          id: mediaItem.id?.toString() || `media-${Date.now()}`,
          file: null, // We can't convert URL back to File object
          preview: mediaItem.url, // Use URL directly as preview
          mediaData: mediaItem, // Store original media data for reference
        }));

        // Only set if no existing images to avoid overriding uploaded files
        setImageLibraries((prev) => {
          if (prev.length === 0) {
            return mediaSections;
          } else {
            return prev;
          }
        });
      }
    }
  }, [chiTietKyNhan, form]);

  // Sync selectedKyNhanId with form
  useEffect(() => {
    if (
      selectedKyNhanId !== null &&
      selectedKyNhanId !== form.getValues("kyNhanId")
    ) {
      form.setValue("kyNhanId", selectedKyNhanId);
    }
  }, [selectedKyNhanId, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get current kyNhanId - values.kyNhanId should be the most reliable
      const currentKyNhanId = values.kyNhanId || selectedKyNhanId;

      if (!currentKyNhanId) {
        toast.error("Vui lòng chọn Kỳ Nhân");

        // Force scroll immediately
        setTimeout(() => {
          if (kyNhanSelectRef.current) {
            kyNhanSelectRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          } else {
            const kyNhanSelect = document.querySelector(
              "[data-ky-nhan-select]"
            );

            if (kyNhanSelect) {
              kyNhanSelect.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            } else {
              // Try to find the actual select component
              const selectElement =
                document.querySelector('button[role="combobox"]') ||
                document.querySelector('[role="combobox"]') ||
                document.querySelector('input[placeholder*="Chọn Kỳ Nhân"]');

              if (selectElement) {
                selectElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              } else {
                const form = document.querySelector("form");
                if (form) {
                  form.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
            }
          }
        }, 100);

        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      const errors: string[] = [];

      // Check historical sections
      historicalInfo.forEach((section, index) => {
        const titleKey = `historical-${section.id}-title`;
        const contentKey = `historical-${section.id}-content`;

        if (!section.title.trim() && touchedFields.has(titleKey)) {
          errors.push(
            `Bối cảnh Lịch sử & Xuất thân - Phần ${
              index + 1
            }: Vui lòng nhập tiêu đề phần`
          );
        }
        if (!section.content.trim() && touchedFields.has(contentKey)) {
          errors.push(
            `Bối cảnh Lịch sử & Xuất thân - Phần ${
              index + 1
            }: Vui lòng nhập đoạn mô tả`
          );
        }
      });

      // Check history sections
      historySections.forEach((section, sectionIndex) => {
        const titleKey = `history-${section.id}-title`;

        if (!section.title.trim() && touchedFields.has(titleKey)) {
          errors.push(
            `Sử Sách Viết Gì - Phần ${
              sectionIndex + 1
            }: Vui lòng nhập tiêu đề phần`
          );
        }
        section.sentences.forEach((sentence, sentenceIndex) => {
          const contentKey = `history-${section.id}-${sentence.id}-content`;

          if (!sentence.content.trim() && touchedFields.has(contentKey)) {
            errors.push(
              `Sử Sách Viết Gì - Phần ${sectionIndex + 1} - Câu ${
                sentenceIndex + 1
              }: Vui lòng nhập nội dung câu viết`
            );
          }
        });
      });

      // Check folklore sections
      folkloreSections.forEach((section, index) => {
        const titleKey = `folklore-${section.id}-title`;
        const contentKey = `folklore-${section.id}-content`;

        if (!section.title.trim() && touchedFields.has(titleKey)) {
          errors.push(
            `Giai thoại dân gian - Phần ${
              index + 1
            }: Vui lòng nhập tiêu đề phần`
          );
        }
        if (!section.content.trim() && touchedFields.has(contentKey)) {
          errors.push(
            `Giai thoại dân gian - Phần ${index + 1}: Vui lòng nhập nội dung`
          );
        }
      });

      // Check reference sections
      referenceSections.forEach((section, index) => {
        const contentKey = `reference-${section.id}-content`;

        if (!section.content.trim() && touchedFields.has(contentKey)) {
          errors.push(
            `Tham khảo - Phần ${index + 1}: Vui lòng nhập nội dung tham khảo`
          );
        }
      });

      if (errors.length > 0) {
        toast.error(errors[0]);
        // Scroll to first error field
        setTimeout(() => {
          const firstErrorField = document.querySelector('[data-error="true"]');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
        return;
      }

      const fd = new FormData();

      // thamKhao: join reference sections' content
      const thamKhaoText = referenceSections
        .map((s) => s.content)
        .filter((s) => !!s)
        .join("\n\n");
      fd.append("thamKhao", thamKhaoText);

      // boiCanhLichSuVaXuatThan: [{ tieuDe, noiDung, nguon }] - Add nguon field
      const boiCanh = historicalInfo
        .filter((s) => s.title || s.content)
        .map((s) => ({
          tieuDe: s.title || "",
          noiDung: s.content || "",
          nguon: s.nguon || "", // Use the nguon field from the form
        }));
      fd.append("boiCanhLichSuVaXuatThan", JSON.stringify(boiCanh));

      // suSachVietGi: [{ tieuDe, doanVan, tacGia, nguonSach }] - Match backend schema
      const suSach = historySections.flatMap((section) =>
        section.sentences
          .filter((se) => se.content || se.source)
          .map((se) => ({
            tieuDe: section.title || "",
            doanVan: se.content || "",
            tacGia: se.tacGia || "", // Use tacGia from the form
            nguonSach: se.source || "", // Map source to nguonSach
          }))
      );
      fd.append("suSachVietGi", JSON.stringify(suSach));

      // giaiThoaiDanGian: [{ tieuDe, noiDung, nguon }] - Match backend schema
      const giaiThoai = folkloreSections
        .filter((s) => s.title || s.content || s.source)
        .map((s) => ({
          tieuDe: s.title || "",
          noiDung: s.content || "",
          nguon: s.source || "",
        }));
      fd.append("giaiThoaiDanGian", JSON.stringify(giaiThoai));

      // Prepare thuVienAnh data for backend sync
      const thuVienAnhData: any[] = [];
      const newFiles: File[] = [];

      imageLibraries.forEach((img) => {
        if (img.file) {
          // New uploaded file - add to files array only, don't add to data array yet
          newFiles.push(img.file);
          // Don't add to thuVienAnhData yet - backend will handle this after upload
        } else if (
          img.mediaData &&
          img.mediaData.id &&
          img.mediaData.url &&
          isValidUrl(img.mediaData.url)
        ) {
          // Existing media from database - only add if has valid URL
          thuVienAnhData.push({
            id: img.mediaData.id,
            url: img.mediaData.url,
            fileName: img.mediaData.fileName || "",
            fileSize: img.mediaData.fileSize || 0,
            mimeType: img.mediaData.mimeType || "image/jpeg",
          });
        }
      });

      // Add thuVienAnh data array to form data
      fd.append("thuVienAnh", JSON.stringify(thuVienAnhData));

      // Add new files to form data
      newFiles.forEach((file) => {
        fd.append("thuVienAnh", file);
      });

      // Add kyNhanId to the data object (required by backend schema)
      fd.append("kyNhanId", String(currentKyNhanId));

      const response = (await chiTietKyNhanService.createChiTietKyNhanForm(
        fd
      )) as any;
      if (response.statusCode === 200 || response.statusCode === 201) {
        const successMessage = chiTietKyNhan
          ? response.message || "Cập nhật chi tiết kỳ nhân thành công!"
          : response.message || "Tạo chi tiết kỳ nhân thành công!";
        toast.success(successMessage);

        // Only reset form if creating new (not updating)
        if (!chiTietKyNhan) {
          // Reset form values only, keep UI sections
          form.reset({
            thamKhao: "",
            boiCanhLichSuVaXuatThan: "",
            suSachVietGi: "",
            giaiThoaiDanGian: "",
            thuVienAnh: [],
          });
          setHasInteracted(false);
          setTouchedFields(new Set());

          // Clear content but keep sections
          setBasicInfo([{ id: "1", title: "", content: "", nguon: "" }]);
          setHistoricalInfo([{ id: "1", title: "", content: "", nguon: "" }]);
          setHistorySections([
            {
              id: "1",
              title: "",
              sentences: [{ id: "1", content: "", source: "", tacGia: "" }],
            },
          ]);
          setFolkloreSections([
            { id: "1", title: "", content: "", source: "" },
          ]);
          setReferenceSections([{ id: "1", content: "" }]);
          setImageLibraries([]);
        }
      } else {
        toast.error(
          response.message || "Có lỗi xảy ra khi tạo chi tiết kỳ nhân"
        );
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi không xác định";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* CSS for TipTap HTML rendering in preview */}
      <style jsx>{`
        .preview-content strong,
        .preview-content b {
          font-weight: 700;
          color: #fbbf24;
        }
        .preview-content em,
        .preview-content i {
          font-style: italic;
          color: #fcd34d;
        }
        .preview-content p {
          margin-bottom: 1rem;
        }
        .preview-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 1.5rem;
        }
        .preview-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 1rem;
        }
        .preview-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fcd34d;
          margin-bottom: 0.75rem;
        }
        .preview-content ul,
        .preview-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .preview-content li {
          margin-bottom: 0.5rem;
        }
        .preview-content blockquote {
          border-left: 4px solid #f59e0b;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #d1d5db;
        }
        .preview-content a {
          color: #fbbf24;
          text-decoration: underline;
        }
        .preview-content a:hover {
          color: #fcd34d;
        }
        .preview-content code {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: "Courier New", monospace;
          color: #fbbf24;
        }
      `}</style>

      <div className="min-h-screen rounded-xl bg-admin-primary p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              setTimeout(() => {
                if (kyNhanSelectRef.current) {
                  kyNhanSelectRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }, 100);
            })}
          >
            {/* KyNhan Selection Section */}
            <Card variant="leftBorder" className="border-l-4 border-[#883C00]">
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Chọn Kỳ Nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Kỳ Nhân
                    </label>
                    <Controller
                      control={form.control}
                      name="kyNhanId"
                      render={({ field, fieldState }) => (
                        <div ref={kyNhanSelectRef} data-ky-nhan-select>
                          <KyNhanSelect
                            value={field.value || null}
                            onChange={(val) => {
                              field.onChange(val);
                              setSelectedKyNhanId(val);
                            }}
                            placeholder="Chọn Kỳ Nhân để tạo thông tin chi tiết"
                            className="w-full"
                          />
                          {fieldState.error && (
                            <p className="text-red-500 text-sm mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  {selectedKyNhanId && (
                    <div className="text-sm text-gray-600">
                      Đã chọn Kỳ Nhân ID: {selectedKyNhanId}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Debug: Form value = {form.watch("kyNhanId")}, Selected ={" "}
                    {selectedKyNhanId}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Context Section */}
            <Card
              variant="leftBorder"
              className="border-l-4 border-[#883C00] mt-8"
            >
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Bối cảnh Lịch sử & Xuất thân
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {historicalInfo.map((section, index) => (
                  <div
                    key={section.id}
                    className="space-y-4 mb-6 last:mb-0 border border-transparent hover:border-gray-200 rounded-lg p-4 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id, "historical")}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        draggable={true}
                        onDragStart={(e) =>
                          handleDragStart(e, section.id, "historical")
                        }
                        onDragEnd={handleDragEnd}
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      <label className="text-sm font-medium text-gray-700">
                        Tiêu đề phần
                      </label>
                    </div>
                    <Input
                      placeholder="Bối cảnh thời đại"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(
                          "historical",
                          section.id,
                          "title",
                          e.target.value
                        )
                      }
                      color="black"
                      className={`rounded-4xl ${
                        !section.title.trim() &&
                        touchedFields.has(`historical-${section.id}-title`)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      data-error={
                        !section.title.trim() &&
                        touchedFields.has(`historical-${section.id}-title`)
                      }
                    />
                    {!section.title.trim() &&
                      touchedFields.has(`historical-${section.id}-title`) && (
                        <p className="text-red-500 text-sm mt-1">
                          Vui lòng nhập tiêu đề phần
                        </p>
                      )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Đoạn văn mô tả
                      </label>
                      <div>
                        <TipTapEditor
                          textColor="black"
                          placeholder="Nhập đoạn văn mô tả dài..."
                          value={section.content}
                          onChange={(value) =>
                            updateSection(
                              "historical",
                              section.id,
                              "content",
                              value
                            )
                          }
                          className={`min-h-32 rounded-4xl ${
                            !section.content.trim() &&
                            touchedFields.has(
                              `historical-${section.id}-content`
                            )
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          data-error={
                            !section.content.trim() &&
                            touchedFields.has(
                              `historical-${section.id}-content`
                            )
                          }
                        />
                        {!section.content.trim() &&
                          touchedFields.has(
                            `historical-${section.id}-content`
                          ) && (
                            <p className="text-red-500 text-sm mt-1">
                              Vui lòng nhập đoạn mô tả
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nguồn
                      </label>
                      <Input
                        placeholder='VD: — Lê Văn Hưu, "Đại Việt Sử Ký Toàn Thư"'
                        value={section.nguon || ""}
                        onChange={(e) =>
                          updateSection(
                            "historical",
                            section.id,
                            "nguon",
                            e.target.value
                          )
                        }
                        color="black"
                        className="rounded-4xl border-gray-300"
                      />
                    </div>
                    {historicalInfo.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection("historical", section.id)}
                        className="self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa phần
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 rounded-full border-gray-300"
                  onClick={() => addSection("historical")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phần
                </Button>
              </CardContent>
            </Card>

            {/* Sử Sách Viết Gì Section */}
            <Card
              variant="leftBorder"
              className="border-l-4 border-[#883C00] mt-8"
            >
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Sử Sách Viết Gì?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {historySections.map((section, index) => (
                  <div
                    key={section.id}
                    className="space-y-4 mb-6 last:mb-0 border border-transparent hover:border-gray-200 rounded-lg p-4 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id, "history")}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        draggable={true}
                        onDragStart={(e) =>
                          handleDragStart(e, section.id, "history")
                        }
                        onDragEnd={handleDragEnd}
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      <label className="text-sm font-medium text-gray-700">
                        Tiêu đề phần
                      </label>
                    </div>
                    <Input
                      placeholder="VD: Đại Việt Sử Ký Toàn Thư"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(
                          "history",
                          section.id,
                          "title",
                          e.target.value
                        )
                      }
                      color="black"
                      className={`rounded-4xl ${
                        !section.title.trim() &&
                        touchedFields.has(`history-${section.id}-title`)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      data-error={
                        !section.title.trim() &&
                        touchedFields.has(`history-${section.id}-title`)
                      }
                    />
                    {!section.title.trim() &&
                      touchedFields.has(`history-${section.id}-title`) && (
                        <p className="text-red-500 text-sm mt-1">
                          Vui lòng nhập tiêu đề phần
                        </p>
                      )}

                    {section.sentences.map((sentence, sentenceIndex) => (
                      <div
                        key={sentence.id}
                        className="space-y-4 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                              Câu viết {sentenceIndex + 1} - Nguồn
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addHistorySentence(section.id)}
                              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm câu viết
                            </Button>
                            {section.sentences.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeHistorySentence(section.id, sentence.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa câu
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <TipTapEditor
                            textColor="black"
                            placeholder="Nhập đoạn câu viết dài..."
                            value={sentence.content}
                            onChange={(value) =>
                              updateHistorySentence(
                                section.id,
                                sentence.id,
                                "content",
                                value
                              )
                            }
                            className={`min-h-24 rounded-4xl ${
                              !sentence.content.trim() &&
                              touchedFields.has(
                                `history-${section.id}-${sentence.id}-content`
                              )
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            data-error={
                              !sentence.content.trim() &&
                              touchedFields.has(
                                `history-${section.id}-${sentence.id}-content`
                              )
                            }
                          />
                          {!sentence.content.trim() &&
                            touchedFields.has(
                              `history-${section.id}-${sentence.id}-content`
                            ) && (
                              <p className="text-red-500 text-sm mt-1">
                                Vui lòng nhập nội dung câu viết
                              </p>
                            )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Tác giả
                          </label>
                          <Input
                            placeholder="VD: Lê Văn Hưu"
                            value={sentence.tacGia || ""}
                            onChange={(e) =>
                              updateHistorySentence(
                                section.id,
                                sentence.id,
                                "tacGia",
                                e.target.value
                              )
                            }
                            color="black"
                            className="rounded-4xl border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Nguồn sách
                          </label>
                          <Input
                            placeholder='VD: "Đại Việt Sử Ký Toàn Thư" - Kỳ Trưng Nữ Vương'
                            value={sentence.source}
                            onChange={(e) =>
                              updateHistorySentence(
                                section.id,
                                sentence.id,
                                "source",
                                e.target.value
                              )
                            }
                            color="black"
                            className="rounded-4xl border-gray-300"
                          />
                        </div>
                      </div>
                    ))}

                    {historySections.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection("history", section.id)}
                        className="self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa phần
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 rounded-full border-gray-300"
                  onClick={() => addSection("history")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phần
                </Button>
              </CardContent>
            </Card>

            {/* Giai thoại dân gian và Truyền thuyết Section */}
            <Card
              variant="leftBorder"
              className="border-l-4 border-[#883C00] mt-8"
            >
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Giai thoại dân gian và Truyền thuyết
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {folkloreSections.map((section, index) => (
                  <div
                    key={section.id}
                    className="space-y-4 mb-6 last:mb-0 border border-transparent hover:border-gray-200 rounded-lg p-4 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id, "folklore")}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        draggable={true}
                        onDragStart={(e) =>
                          handleDragStart(e, section.id, "folklore")
                        }
                        onDragEnd={handleDragEnd}
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      <label className="text-sm font-medium text-gray-700">
                        Tiêu đề phần
                      </label>
                    </div>
                    <Input
                      placeholder="VD: Cuộc hôn nhân giữa Trưng Trắc và Thi Sách:"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(
                          "folklore",
                          section.id,
                          "title",
                          e.target.value
                        )
                      }
                      color="black"
                      className={`rounded-4xl ${
                        !section.title.trim() &&
                        touchedFields.has(`folklore-${section.id}-title`)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      data-error={
                        !section.title.trim() &&
                        touchedFields.has(`folklore-${section.id}-title`)
                      }
                    />
                    {!section.title.trim() &&
                      touchedFields.has(`folklore-${section.id}-title`) && (
                        <p className="text-red-500 text-sm mt-1">
                          Vui lòng nhập tiêu đề phần
                        </p>
                      )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nội dung
                      </label>
                      <div>
                        <TipTapEditor
                          textColor="black"
                          placeholder="Nhập đoạn văn mô tả dài..."
                          value={section.content}
                          onChange={(value) =>
                            updateSection(
                              "folklore",
                              section.id,
                              "content",
                              value
                            )
                          }
                          className={`min-h-32 rounded-4xl ${
                            !section.content.trim() &&
                            touchedFields.has(`folklore-${section.id}-content`)
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          data-error={
                            !section.content.trim() &&
                            touchedFields.has(`folklore-${section.id}-content`)
                          }
                        />
                        {!section.content.trim() &&
                          touchedFields.has(
                            `folklore-${section.id}-content`
                          ) && (
                            <p className="text-red-500 text-sm mt-1">
                              Vui lòng nhập nội dung
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nguồn
                      </label>
                      <Input
                        placeholder='VD: — Lê Văn Hưu, "Đại Việt Sử Ký Toàn Thư" - Kỳ Trưng Nữ Vương'
                        value={section.source}
                        onChange={(e) =>
                          updateSection(
                            "folklore",
                            section.id,
                            "source",
                            e.target.value
                          )
                        }
                        color="black"
                        className="rounded-4xl border-gray-300"
                      />
                    </div>

                    {folkloreSections.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection("folklore", section.id)}
                        className="self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa phần
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 rounded-full border-gray-300"
                  onClick={() => addSection("folklore")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phần
                </Button>
              </CardContent>
            </Card>

            {/* Tham khảo Section */}
            <Card
              variant="leftBorder"
              className="border-l-4 border-[#883C00] mt-8"
            >
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Tham khảo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {referenceSections.map((section, index) => (
                  <div
                    key={section.id}
                    className="space-y-4 mb-6 last:mb-0 border border-transparent hover:border-gray-200 rounded-lg p-4 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id, "reference")}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        draggable={true}
                        onDragStart={(e) =>
                          handleDragStart(e, section.id, "reference")
                        }
                        onDragEnd={handleDragEnd}
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      <label className="text-sm font-medium text-gray-700">
                        Nguồn tham khảo
                      </label>
                    </div>
                    <div>
                      <TipTapEditor
                        textColor="black"
                        placeholder="Nhập các nguồn tham khảo..."
                        value={section.content}
                        onChange={(value) =>
                          updateSection(
                            "reference",
                            section.id,
                            "content",
                            value
                          )
                        }
                        className={`min-h-24 rounded-4xl ${
                          !section.content.trim() &&
                          touchedFields.has(`reference-${section.id}-content`)
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        data-error={
                          !section.content.trim() &&
                          touchedFields.has(`reference-${section.id}-content`)
                        }
                      />
                      {!section.content.trim() &&
                        touchedFields.has(
                          `reference-${section.id}-content`
                        ) && (
                          <p className="text-red-500 text-sm mt-1">
                            Vui lòng nhập nội dung tham khảo
                          </p>
                        )}
                    </div>

                    {referenceSections.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection("reference", section.id)}
                        className="self-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa phần
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 rounded-full border-gray-300"
                  onClick={() => addSection("reference")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phần
                </Button>
              </CardContent>
            </Card>

            {/* Thư viện ảnh Section */}
            <Card
              variant="leftBorder"
              className="border-l-4 border-[#883C00] mt-8"
            >
              <CardHeader className="bg-gray-100 rounded-tl-3xl">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <LucideIcon name="BookOpen" iconSize={20} />
                  Thư viện ảnh
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Vùng drop chung cho nhiều ảnh */}
                <div
                  onClick={() => handleImageUpload("imageLibrary")}
                  onDragOver={handleImageDragOver}
                  onDragEnter={handleImageDragEnter}
                  onDragLeave={handleImageDragLeave}
                  onDrop={(e) => handleImageDrop(e, "imageLibrary")}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors relative mb-6"
                >
                  <div>
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Kéo thả nhiều hình ảnh vào đây hoặc nhấp để chọn
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Hỗ trợ nhiều file cùng lúc
                    </p>
                    <Button
                      type="button"
                      className="rounded-full border-gray-300"
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Chọn nhiều hình ảnh
                    </Button>
                  </div>
                </div>

                {/* Danh sách các ảnh đã upload */}
                {imageLibraries.filter((img) => img.file || img.preview)
                  .length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Hình ảnh đã tải lên (
                      {
                        imageLibraries.filter((img) => img.file || img.preview)
                          .length
                      }
                      )
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {imageLibraries
                        .filter((img) => img.file || img.preview)
                        .map((imageSection, index) => (
                          <div
                            key={imageSection.id}
                            className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-center max-h-48 overflow-hidden rounded-lg">
                              {(imageSection.file || imageSection.preview) && (
                                <img
                                  src={imageSection.preview}
                                  alt={`Library preview ${index + 1}`}
                                  className="max-w-full max-h-full object-contain border border-yellow-500 rounded-lg"
                                />
                              )}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeSection("imageLibrary", imageSection.id)
                                }
                                className="text-xs"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="border-2 border-stone-300 mt-8">
              <CardHeader className="bg-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Eye className="h-5 w-5" />
                  Xem trước
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Document-style Preview */}
                <div
                  data-preview="true"
                  className="relative bg-gradient-to-br from-amber-900 via-gray-800 to-amber-900 rounded-lg overflow-hidden shadow-2xl min-h-[800px]"
                  style={{
                    background: `
                  linear-gradient(135deg, #451a03 0%, #1f2937 50%, #451a03 100%),
                  radial-gradient(circle at 20% 80%, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(120, 53, 15, 0.2) 0%, transparent 50%),
                  url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                `,
                    backgroundAttachment: "fixed",
                  }}
                >
                  {/* Scroll-style content */}
                  <div className="relative p-12 text-white max-w-4xl mx-auto">
                    {/* Main Title */}
                    <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold mb-6 text-amber-300 tracking-wide leading-tight">
                        {imageInfo.title || "BỐI CẢNH LỊCH SỬ VÀ XUẤT THÂN"}
                      </h1>
                    </div>

                    {/* Library Image Preview */}
                    {libraryImage && (
                      <div className="flex justify-center mb-12">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg opacity-75 blur-sm"></div>
                          <div className="relative border-4 border-amber-500 rounded-lg overflow-hidden max-w-lg shadow-2xl">
                            <img
                              src={URL.createObjectURL(libraryImage)}
                              alt="Library preview"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Summary */}
                    {imageInfo.summary && (
                      <div className="text-center mb-12 px-8">
                        <div className="inline-block border-l-4 border-r-4 border-amber-500 px-8 py-4">
                          <div
                            className="text-xl text-amber-100 leading-relaxed preview-content"
                            dangerouslySetInnerHTML={{
                              __html: imageInfo.summary,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Short Description */}
                    {imageInfo.shortDescription && (
                      <div className="mb-12">
                        <div
                          className="text-gray-200 leading-relaxed text-lg preview-content"
                          style={{
                            fontFamily: "Georgia, serif",
                            lineHeight: "1.8",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: imageInfo.shortDescription,
                          }}
                        />
                      </div>
                    )}

                    {/* Basic Information Sections */}
                    {basicInfo.filter(
                      (section) => section.title || section.content
                    ).length > 0 && (
                      <div className="space-y-8 mb-12">
                        {basicInfo
                          .filter((section) => section.title || section.content)
                          .map((section, index) => (
                            <div key={section.id} className="space-y-4">
                              {section.title && (
                                <h3 className="text-2xl font-bold text-amber-300 border-b-2 border-amber-500 pb-3 mb-6">
                                  {section.title.toUpperCase()}
                                </h3>
                              )}
                              {section.content && (
                                <div
                                  className="text-gray-200 leading-relaxed text-lg preview-content"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    lineHeight: "1.8",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: section.content,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Historical Context Sections */}
                    {historicalInfo.filter(
                      (section) => section.title || section.content
                    ).length > 0 && (
                      <div className="space-y-8 mb-12">
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wide">
                            BỐI CẢNH LỊCH SỬ VÀ XUẤT THÂN
                          </h2>
                          <div className="w-32 h-1 bg-amber-500 mx-auto rounded"></div>
                        </div>
                        {historicalInfo
                          .filter((section) => section.title || section.content)
                          .map((section, index) => (
                            <div key={section.id} className="space-y-4">
                              {section.title && (
                                <h3 className="text-2xl font-bold text-amber-300 border-b border-amber-500 pb-3 mb-6">
                                  {section.title.toUpperCase()}
                                </h3>
                              )}
                              {section.content && (
                                <div
                                  className="text-gray-200 leading-relaxed text-lg preview-content"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    lineHeight: "1.8",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: section.content,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* History Books Sections */}
                    {historySections.filter(
                      (section) =>
                        section.title ||
                        section.sentences.some((s) => s.content)
                    ).length > 0 && (
                      <div className="space-y-8 mb-12">
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wide">
                            SỬ SÁCH VIẾT GÌ?
                          </h2>
                          <div className="w-32 h-1 bg-amber-500 mx-auto rounded"></div>
                        </div>
                        {historySections
                          .filter(
                            (section) =>
                              section.title ||
                              section.sentences.some((s) => s.content)
                          )
                          .map((section, index) => (
                            <div key={section.id} className="space-y-6">
                              {section.title && (
                                <h3 className="text-2xl font-bold text-amber-300 border-b border-amber-500 pb-3 mb-6">
                                  {section.title.toUpperCase()}
                                </h3>
                              )}

                              <div className="space-y-6">
                                {section.sentences
                                  .filter(
                                    (sentence) =>
                                      sentence.content || sentence.source
                                  )
                                  .map((sentence, sentenceIndex) => (
                                    <div
                                      key={sentence.id}
                                      className="space-y-3"
                                    >
                                      {sentence.content && (
                                        <div
                                          className="text-gray-200 leading-relaxed text-lg pl-4 preview-content"
                                          style={{
                                            fontFamily: "Georgia, serif",
                                            lineHeight: "1.8",
                                            borderLeft: "3px solid #f59e0b",
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html: sentence.content,
                                          }}
                                        />
                                      )}
                                      {sentence.source && (
                                        <div className="ml-8">
                                          <div
                                            className="text-amber-200 italic text-base font-medium preview-content"
                                            dangerouslySetInnerHTML={{
                                              __html: sentence.source,
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Folklore Sections */}
                    {folkloreSections.filter(
                      (section) => section.title || section.content
                    ).length > 0 && (
                      <div className="space-y-8 mb-12">
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wide">
                            GIAI THOẠI DÂN GIAN VÀ TRUYỀN THUYẾT
                          </h2>
                          <div className="w-32 h-1 bg-amber-500 mx-auto rounded"></div>
                        </div>
                        {folkloreSections
                          .filter((section) => section.title || section.content)
                          .map((section, index) => (
                            <div key={section.id} className="space-y-4">
                              {section.title && (
                                <h3 className="text-2xl font-bold text-amber-300 border-b border-amber-500 pb-3 mb-6">
                                  {section.title.toUpperCase()}
                                </h3>
                              )}
                              {section.content && (
                                <div
                                  className="text-gray-200 leading-relaxed text-lg preview-content"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    lineHeight: "1.8",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: section.content,
                                  }}
                                />
                              )}
                              {section.source && (
                                <div className="ml-8 mt-4">
                                  <div
                                    className="text-amber-200 italic text-base font-medium preview-content"
                                    dangerouslySetInnerHTML={{
                                      __html: section.source,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* References */}
                    {referenceSections.filter((section) => section.content)
                      .length > 0 && (
                      <div className="space-y-6 mb-12">
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wide">
                            THAM KHẢO
                          </h2>
                          <div className="w-32 h-1 bg-amber-500 mx-auto rounded"></div>
                        </div>
                        <div className="space-y-4">
                          {referenceSections
                            .filter((section) => section.content)
                            .map((section, index) => (
                              <div key={section.id}>
                                <div
                                  className="text-gray-200 leading-relaxed text-lg preview-content"
                                  style={{
                                    fontFamily: "Georgia, serif",
                                    lineHeight: "1.8",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: section.content,
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Image Library */}
                    {imageLibraries.filter((img) => img.file || img.preview)
                      .length > 0 && (
                      <div className="space-y-8 mb-12">
                        <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-amber-300 mb-2 tracking-wide">
                            THƯ VIỆN ẢNH
                          </h2>
                          <div className="w-32 h-1 bg-amber-500 mx-auto rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {imageLibraries
                            .filter((img) => img.file || img.preview)
                            .map((imageSection, index) => (
                              <div
                                key={imageSection.id}
                                className="relative group"
                              >
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
                                <div className="relative border-2 border-amber-500 rounded-lg overflow-hidden bg-gray-800">
                                  {(imageSection.file ||
                                    imageSection.preview) && (
                                    <img
                                      src={imageSection.preview}
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Show message if no content */}
                    {!imageInfo.title &&
                      !imageInfo.summary &&
                      !imageInfo.shortDescription &&
                      basicInfo.filter((s) => s.title || s.content).length ===
                        0 &&
                      historicalInfo.filter((s) => s.title || s.content)
                        .length === 0 &&
                      historySections.filter(
                        (s) => s.title || s.sentences.some((se) => se.content)
                      ).length === 0 &&
                      folkloreSections.filter((s) => s.title || s.content)
                        .length === 0 &&
                      referenceSections.filter((s) => s.content).length === 0 &&
                      imageLibraries.filter((img) => img.file || img.preview)
                        .length === 0 && (
                        <div className="text-center text-gray-400 mt-32">
                          <div className="relative">
                            <div className="absolute -inset-4 bg-amber-500 opacity-20 rounded-full blur-xl"></div>
                            <div className="relative bg-gray-800 bg-opacity-50 rounded-lg p-12 border border-amber-500 border-opacity-30">
                              <Eye className="h-20 w-20 mx-auto mb-6 text-amber-400 opacity-60" />
                              <p className="text-xl mb-2 font-medium">
                                Chưa có nội dung để xem trước
                              </p>
                              <p className="text-sm opacity-75">
                                Nhập thông tin ở các phần trên để xem preview
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Scroll-like decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30"></div>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    className="bg-stone-600 hover:bg-stone-700 text-white"
                    onClick={() => {
                      // Scroll to preview
                      const previewElement = document.querySelector(
                        '[data-preview="true"]'
                      );
                      previewElement?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem trước dạng bài viết
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-6 mt-8">
              <Button
                type="button"
                variant="outline"
                className="bg-stone-50 border-stone-300"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-stone-600 hover:bg-stone-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : chiTietKyNhan ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CardStoryPage;
