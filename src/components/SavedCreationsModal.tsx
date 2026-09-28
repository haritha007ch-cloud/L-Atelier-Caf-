import React from 'react';
import { CustomizationSelection, MenuItem, SavedRecipe } from '../types/cafe';
import { FLAVOR_OPTIONS, MILK_OPTIONS, ROAST_OPTIONS } from '../data/cafeData';
import { X, Bookmark, Trash2, Wand2, Plus, Sparkles } from 'lucide-react';

interface SavedCreationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: SavedRecipe[];
  menuItems: MenuItem[];
  onSelectRecipeForCustomization: (menuItem: MenuItem, customization: CustomizationSelection) => void;
  onDeleteRecipe: (id: string) => void;
  onOpenCustomizerForNew: () => void;
}

export const SavedCreationsModal: React.FC<SavedCreationsModalProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  menuItems,
  onSelectRecipeForCustomization,
  onDeleteRecipe,
  onOpenCustomizerForNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-900" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              My Saved Flavor Creations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Recipes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedRecipes.length > 0 ? (
            savedRecipes.map((recipe) => {
              const baseItem = menuItems.find((m) => m.id === recipe.menuItemId) || menuItems[0];
              const roast = ROAST_OPTIONS.find((r) => r.id === recipe.customization.roastId);
              const milk = MILK_OPTIONS.find((m) => m.id === recipe.customization.milkId);

              const flavorNames = recipe.customization.selectedFlavors.map((sf) => {
                const f = FLAVOR_OPTIONS.find((item) => item.id === sf.flavorId);
                return `${sf.pumps}x ${f?.name || ''}`;
              });

              return (
                <div
                  key={recipe.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-700/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Saved Creation</span>
                      </div>
                      <h3 className="font-display font-bold text-stone-900 text-base">
                        {recipe.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Base: {baseItem.name} ({recipe.customization.size}, {recipe.customization.temp})
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteRecipe(recipe.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Remove saved recipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Flavor & Milk Tags */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Flavor:</span>
                      <span className="font-medium text-stone-800">
                        {flavorNames.length > 0 ? flavorNames.join(' + ') : 'Pure (No syrups)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Sweetness:</span>
                      <span className="font-mono text-stone-700">{recipe.customization.sweetnessLevel}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Milk & Roast:</span>
                      <span className="font-medium text-stone-800">
                        {milk?.name.split(' ')[0]} · {roast?.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => {
                      onSelectRecipeForCustomization(baseItem, recipe.customization);
                      onClose();
                    }}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Load & Customize in Studio</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-800">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-bold text-stone-800 mb-1">
                No saved formulations yet
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                When customizing a drink, click &ldquo;Save Formulation&rdquo; in the top bar to bookmark your favorite flavor combinations.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomizerForNew();
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors"
              >
                Create a Custom Recipe Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
