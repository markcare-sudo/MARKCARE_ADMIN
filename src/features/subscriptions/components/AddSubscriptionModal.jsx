import { useState } from "react";
import Modal from "@/components/ui/Modal";
import SubscriptionPlanForm from "./SubscriptionPlanForm";
import { useFeatures } from "@/context/FeatureContext";

const AddSubscriptionModal = ({ isOpen, onClose, subscriptionData, onSave }) => {
  const { features } = useFeatures()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      // payload now contains the formatted data from the form
      await onSave(subscriptionData?.id || null, payload);
      onClose();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subscriptionData ? "Edit Subscription Plan" : "Add Subscription Plan"}
      className="max-w-3xl" // Slightly wider for plan features table
    >
      <SubscriptionPlanForm
        initialData={subscriptionData}
        availableFeatures={features}
        loading={loading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default AddSubscriptionModal;