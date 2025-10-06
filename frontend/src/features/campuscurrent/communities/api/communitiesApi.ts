import { apiCall } from "@/utils/api";
import { queryOptions } from "@tanstack/react-query";
import * as Routes from "@/data/routes";
import {
  Community,
  CreateCommunityData,
  EditCommunityData,
  CommunityPermissions,
} from "@/features/campuscurrent/types/types";

export const campuscurrentAPI = {
  getCommunitiesQueryOptions: (params: { page?: number; size?: number; keyword?: string | null; category?: string | null; recruitment_status?: string | null } = {}) => {
    const normalizedParams = {
      page: params.page ?? 1,
      size: params.size ?? 12,
      keyword: params.keyword ?? null,
      category: params.category ?? null,
      recruitment_status: params.recruitment_status ?? null,
    } as const;

    const queryParams = new URLSearchParams();
    queryParams.set("page", String(normalizedParams.page));
    queryParams.set("size", String(normalizedParams.size));
    if (normalizedParams.keyword) queryParams.set("keyword", String(normalizedParams.keyword));
    if (normalizedParams.category) queryParams.set("community_category", String(normalizedParams.category));
    if (normalizedParams.recruitment_status)
      queryParams.set("recruitment_status", String(normalizedParams.recruitment_status));

    return {
      queryKey: [
        "campusCurrent",
        "communities",
        normalizedParams.page,
        normalizedParams.size,
        normalizedParams.keyword ?? "",
        normalizedParams.category ?? "",
        normalizedParams.recruitment_status ?? "",
      ] as const,
      queryFn: async () => {
        const res = await apiCall<any>(
          `/` + Routes.COMMUNITIES + `?` + queryParams.toString()
        );
        // Normalize num_of_pages -> total_pages for backward compatibility
        if (
          res &&
          typeof res.total_pages !== "number" &&
          typeof res.num_of_pages === "number"
        ) {
          res.total_pages = res.num_of_pages;
        }
        return res as Types.PaginatedResponse<Community, "communities">;
      },
    };
  },
  getCommunityQueryOptions: (id: string) => {
    return queryOptions({
      queryKey: ["campusCurrent", "community", id],
      queryFn: () => {
        return apiCall<{ community: Community; permissions: CommunityPermissions }>(
          `/` + Routes.COMMUNITIES + `/${id}`
        );
      },
    });
  },
  addCommunity: (data: CreateCommunityData) => {
    return apiCall<Community>(`/` + Routes.COMMUNITIES, {
      method: "POST",
      json: data,
    });
  },

  editCommunity: (id: string, data: EditCommunityData) => {
    return apiCall<Community>(`/` + Routes.COMMUNITIES + `/${id}`, {
      method: "PATCH",
      json: data,
    });
  },

  deleteCommunity: (id: string) => {
    return apiCall(`/` + Routes.COMMUNITIES + `/${id}`, {
      method: "DELETE",
    });
  },

  getUserCommunitiesQueryOptions: (userSub: string) => {
    return queryOptions({
      queryKey: ["campusCurrent", "userCommunities", userSub],
      queryFn: async () => {
        const queryParams = new URLSearchParams();
        queryParams.set("head", userSub);
        queryParams.set("size", "100"); // Get all communities for the user
        queryParams.set("page", "1");
        
        const res = await apiCall<any>(
          `/` + Routes.COMMUNITIES + `?` + queryParams.toString()
        );
        return res as Types.PaginatedResponse<Community, "communities">;
      },
    });
  },
};

