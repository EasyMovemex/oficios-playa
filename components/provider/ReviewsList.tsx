import { View, Text } from 'react-native';
import { Avatar, Rating, EmptyState } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import type { ReviewWithReviewer } from '@/hooks/useProviders';

type ReviewsListProps = {
  reviews: ReviewWithReviewer[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ReviewCard({ review }: { review: ReviewWithReviewer }) {
  return (
    <View
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Avatar
          uri={review.profiles.avatar_url}
          name={review.profiles.full_name}
          size={36}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.textPrimary }}>
            {review.profiles.full_name}
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textSecondary }}>
            {formatDate(review.created_at)}
          </Text>
        </View>
        <Rating value={review.rating} />
      </View>
      {review.comment && (
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, lineHeight: 20 }}>
          {review.comment}
        </Text>
      )}
    </View>
  );
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon="star-outline"
        title="Sin reseñas aún"
        subtitle="Este prestador aún no tiene reseñas de clientes"
      />
    );
  }

  return (
    <View>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
}
