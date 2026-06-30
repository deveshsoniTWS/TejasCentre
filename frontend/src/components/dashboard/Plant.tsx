import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getPlants } from '../../service/plant.service';
import { getLocations } from '../../service/location.service';
import { resolveCardImage } from '../../utils/cardImage';

interface Location {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

interface Plant {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

type BreadcrumbItem = {
    label: string;
    view: 'location' | 'plant';
    plantId?: string;
};

function Plant() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingPlants, setIsLoadingPlants] = useState(true);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);

    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { label: 'Plant', view: 'plant' },
    ]);

    const currentView = breadcrumbs[breadcrumbs.length - 1];

    useEffect(() => {
        const fetchPlants = async () => {
            setIsLoadingPlants(true);
            try {
                const res = await getPlants();
                setPlants(res.body?.data ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingPlants(false);
            }
        };
        fetchPlants();
    }, []);

    useEffect(() => {
        if (currentView.view !== 'location' || !currentView.plantId) return;

        const fetchLocations = async () => {
            setIsLoadingLocations(true);
            try {
                const res = await getLocations({ plantId: currentView.plantId });
                setLocations(res.body?.data ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingLocations(false);
            }
        };

        fetchLocations();
    }, [currentView]);

    const handlePlantClick = (plant: Plant) => {
        setBreadcrumbs((prev) => [
            ...prev,
            {
                label: plant.name,
                view: 'location',
                plantId: plant.id,
            },
        ]);
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === breadcrumbs.length - 1) return;
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
        if (breadcrumbs[index].view === 'plant') {
            setLocations([]);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-1 overflow-auto">

                <div className="flex flex-row flex-wrap items-center gap-1 h-auto bg-surface-card mb-2">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;
                        return (
                            <span key={index} className="flex items-center">
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    disabled={isLast}
                                    className={`text-lg font-medium transition-colors${isLast
                                        ? 'cursor-default'
                                        : 'hover:underline cursor-pointer'
                                        }
                                        ${isFirst
                                            ? 'text-text-primary'
                                            : 'text-brand-danger font-bold'
                                        }
                                `}
                                >
                                    {crumb.label}
                                </button>
                                {!isLast && (
                                    <span className="text-brand-danger mx-1 select-none">&gt;</span>
                                )}
                            </span>
                        );
                    })}
                </div>

                {currentView.view === 'plant' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingPlants && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading plants...</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.map((plant) => (
                            <OrganizationCard
                                key={plant.id}
                                name={plant.name}
                                image={resolveCardImage(plant.image, plant.name)}
                                onclick={() => handlePlantClick(plant)}
                            />
                        ))}
                    </div>
                )}

                {currentView.view === 'location' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingLocations && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading locations...</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No locations found</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.map((location) => (
                            <OrganizationCard
                                key={location.id}
                                name={location.name}
                                image={resolveCardImage(location.image, location.name)}
                                onclick={() => {/* handle location click if needed */ }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Plant;
