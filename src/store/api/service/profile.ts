import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
   ProfileDetailResponse,
   ProfileEditRequest,
   ProfileEditResponse,
} from "../interface/profile";
import { getHeader } from "../../../_poke/utils/function";

export const profile = createApi({
   reducerPath: "profile",
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL + "/profiles/",
      prepareHeaders: (headers, { getState }) => getHeader(headers, getState),
   }),
   tagTypes: ["ProfileDetail"],
   endpoints: (builder) => ({
      profileDetail: builder.query<ProfileDetailResponse, string>({
         query: (username) => username,
         providesTags: ["ProfileDetail"],
      }),
      editProfile: builder.mutation<ProfileEditResponse, ProfileEditRequest>({
         query: ({ id, ...body }) => ({ url: id, method: "PATCH", body }),
         invalidatesTags: ["ProfileDetail"],
      }),
   }),
});

export const { useProfileDetailQuery, useEditProfileMutation } = profile;
