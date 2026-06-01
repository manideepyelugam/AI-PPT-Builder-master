"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import usePromptStore from "@/store/usePromptStore";
import TemplateSelect from "./template-select/templateSelect";
import MethodSelect from "./method-select/methodSelect";
import CreateAI from "./generate-ai/creativeAI";
import ManualMode from "./manual/manualMode";

const RenderPage = () => {
  const { page, setPage, selectedTheme } = usePromptStore();

  // Guard: never let users land on a downstream step without a template.
  useEffect(() => {
    if (
      (page === "method-select" ||
        page === "creative-ai" ||
        page === "manual") &&
      !selectedTheme
    ) {
      setPage("template-select");
    }
  }, [page, selectedTheme, setPage]);

  const renderStep = () => {
    switch (page) {
      case "template-select":
        return <TemplateSelect />;
      case "method-select":
        return <MethodSelect />;
      case "creative-ai":
        return <CreateAI />;
      case "manual":
        return <ManualMode />;
      default:
        return <TemplateSelect />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default RenderPage;
