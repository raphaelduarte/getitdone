import create from 'zustand';

const useUserStore = create((set) => ({
    newTeamDocStore: "newTeamDocStore está vazio",
    setNewTeamDocStore: (value) => set({ newTeamDocStore: value }),

    selectedColumnStore: "selectedColumnStore está vazio",
    setSelectedColumnStore: (value) => set({ selectedColumnStore: value }),

    userDocStore: "userDocStore está vazio",
    setUserDocStore: (value) => set({ userDocStore: value }),

    searchStore: "",
    setSearchStore: (value) => set({ searchStore: value }),

    selectedTagStore: "",
    setSelectedTagStore: (value) => set({ selectedTagStore: value }),

    selectedMemberStore: "",
    setSelectedMemberStore: (value) => set({ selectedMemberStore: value }),

    selectedMemberNameStore: "",
    setSelectedMemberNameStore: (value) => set({ selectedMemberNameStore: value }),

    selectedPriorityStore: "",
    setSelectedPriorityStore: (value) => set({ selectedPriorityStore: value }),
}));

export { useUserStore };