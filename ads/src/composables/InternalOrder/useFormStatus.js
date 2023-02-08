import { ref, onMounted } from "vue";
import { useRoute } from "@/router/useRoute.js";

const useFormStatus = () => {
  const formStatus = ref("");
  const { route } = useRoute();

  onMounted(() => {
    switch (route.name) {
      case "CreateInternalOrder":
        formStatus.value = "create";
        break;
      case "EditInternalOrder":
        formStatus.value = "edit";
        break;
      default:
        formStatus.value = "view";
        break;
    }
  });

  return { formStatus };
};

export default useFormStatus;
